import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { MongoServerError } from 'mongodb';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role } from '@app/auth/role.enum';
import { LoginDto } from '@app/auth/dto/login.dto';
import { UserUpdateDto } from '@app/auth/dto/user.update';
import { User } from '@app/auth/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import {
  DuplicateUsernameError,
  DeceasedUserError,
  InvalidLogin,
  NonExistingUserError,
} from '@app/auth/errors';

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
    if (!user) throw new InvalidLogin(loginDto.username);
    if (!user.isActive) throw new DeceasedUserError(user.username);
    return {
      access_token: this.jwtService.sign({
        sub: user._id,
        username: user.username,
        role: user.role,
      }),
    };
  }

  async registerUser(username: string, password: string, role: Role) {
    const hash = await bcrypt.hash(password, 10);
    const user = new this.userModel({ username, password: hash, role: role });
    try {
      return await user.save();
    } catch (err) {
      if (err instanceof MongoServerError && err.code === 11000) {
        throw new DuplicateUsernameError(username);
      } else {
        throw err;
      }
    }
  }

  async updateUser(updateDto: UserUpdateDto){
    const { username: username, ...updateFields } = updateDto;
    const updatedUser = await this.userModel.findOneAndUpdate(
      { username },
      { $set: updateFields },
      { new: true },
    );

    if (!updatedUser) {
      throw new NonExistingUserError(`Username ${username} not found`);
    }

    return true;
  }
}
