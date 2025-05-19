import { BadRequestException, Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from '@app/app.service';
import { AuthService } from '@app/auth/service';
import { LoginDto } from '@app/auth/dto/login.dto';
import { UserRole } from '@app/auth/constants';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRegistrationDto } from '@app/auth/dto/user.registration.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {}

  @Get('hello')
  async getHello() {
    return this.appService.getHello();
  }
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
  @ApiOperation({
    summary: 'signup',
    description: 'signup api',
  })
  @ApiBody({
    type: UserRegistrationDto,
  })
  @Post('signup')
  async signup(@Body() registrationDto: UserRegistrationDto) {
    if (registrationDto.password != registrationDto.re_password) {
      throw new BadRequestException('passwords do not match');
    }
    const user = await this.authService.registerUser(
      registrationDto.username,
      registrationDto.password,
      UserRole.USER,
    );

    return {
      username: user.username,
    };
  }
}
