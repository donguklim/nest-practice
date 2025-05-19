import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@app/auth/constants';
import { LoginDto } from '@app/auth/dto/login.dto';
import { User } from '@app/auth/user.interface';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User')
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (!user.isActive) throw new UnauthorizedException('Suspended user');
    return {
      access_token: this.jwtService.sign({
        sub: user._id,
        username: user.username,
        role: user.role,
      }),
    };
  }

  async registerUser(username: string, password: string, role: UserRole) {
    const hash = await bcrypt.hash(password, 10);
    const user = new this.userModel({ username, password: hash, role: role });
    return user.save();
  }
}
