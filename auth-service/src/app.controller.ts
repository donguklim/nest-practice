import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  Post, UnauthorizedException,
} from '@nestjs/common';
import { AppService } from '@app/app.service';
import { AuthService } from '@app/auth/service';
import { LoginDto } from '@app/auth/dto/login.dto';
import { UserRole } from '@app/auth/constants';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { UserRegistrationDto } from '@app/auth/dto/user.registration.dto';
import {
  DuplicateUsernameError,
  DeceasedUserError,
  InvalidLogin,
} from '@app/auth/errors';

@Controller('auth')
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
    try {
      return await this.authService.login(loginDto);
    } catch (err) {
      if (err instanceof InvalidLogin || err instanceof DeceasedUserError) {
        throw new UnauthorizedException(err.message);
      } else {
        throw err;
      }
    }
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
    try {
      await this.authService.registerUser(
        registrationDto.username,
        registrationDto.password,
        UserRole.USER,
      );
    } catch (err) {
      if (err instanceof DuplicateUsernameError) {
        throw new ConflictException(err.message);
      } else {
        throw err;
      }
    }
    return {
      message: `User ${registrationDto.username} is created`,
    };
  }
}
