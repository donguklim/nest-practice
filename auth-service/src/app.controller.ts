import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from '@app/app.service';
import { AuthService } from '@app/auth/service';
import { LoginDto } from '@app/auth/dto/login.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  async getHello() {
    return this.appService.getHello();
  }
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
  @Post('register')
  async register(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
