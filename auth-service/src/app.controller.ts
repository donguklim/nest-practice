import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AppService } from '@app/app.service';
import { AuthService } from '@app/auth/service';
import { LoginDto } from '@app/auth/dto/login.dto';
import { UserUpdateDto } from '@app/auth/dto/user.update';
import { Role } from '@app/auth/role.enum';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { UserRegistrationDto } from '@app/auth/dto/user.registration.dto';
import {
  DuplicateUsernameError,
  DeceasedUserError,
  InvalidLogin,
  NonExistingUserError,
} from '@app/auth/errors';

@Controller('auth')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({
    summary: 'login',
    description: 'login api',
  })
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
        Role.USER,
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
  @ApiOperation({
    summary: 'user update api',
    description: 'User update api only can be used by admin',
  })
  @Post('admin/update')
  async update(@Body() userUpdateDto: UserUpdateDto) {
    try {
      await this.authService.updateUser(userUpdateDto);
    } catch (err) {
      if (err instanceof NonExistingUserError) {
        throw new ConflictException(err.message);
      } else {
        throw err;
      }
    }
    return {
      message: `User ${userUpdateDto.username} is updated`,
    };
  }
}
