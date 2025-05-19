import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from '@app/app.service';
import { JwtAuthGuard } from '@app/auth/jwt-auth.guard';
import { RolesGuard } from '@app/auth/roles.guard';
import { Roles } from '@app/auth/roles.decorator';
import { Role } from '@app/auth/role.enum';
import { Request } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller()
@ApiBearerAuth('access-token')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  //@Roles(Role.USER)
  async hello() {
    return 'hello';
  }
  @Get('user')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  async getUserProfile(@Req() req: Request) {
    return req.user;
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getAdminProfile(@Req() req: Request) {
    return req.user;
  }
}
