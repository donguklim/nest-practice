import { Controller, Get, Post, Req, Res, UseGuards, HttpStatus, Options } from '@nestjs/common';
import { JwtAuthGuard } from '@app/auth/jwt-auth.guard';
import { RolesGuard } from '@app/auth/roles.guard';
import { Roles } from '@app/auth/roles.decorator';
import { Role } from '@app/auth/role.enum';
import { Request, Response } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as process from 'node:process';

@Controller()
@ApiBearerAuth('access-token')
export class AppController {
  constructor(private readonly http: HttpService) {}
  private async forwardRequest(req: Request, res: Response, target: string) {
    try {
      const response = await firstValueFrom(
        this.http.request({
          method: req.method as any,
          url: target,
          headers: {
            ...req.headers,
            host: undefined, // optional: remove host header
          },
          data: req.body,
          validateStatus: () => true,
        }),
      );
      res.status(response.status).set(response.headers).send(response.data);
    } catch (err) {
      console.error('[Proxy Error]', err);
      res.status(500).send('Gateway error');
    }
  }
  @Post('auth/admin/*')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async adminAuth(@Req() req: Request, @Res() res: Response) {
    const targetUrl = `${process.env.AUTH_URL}${req.originalUrl}`;
    return this.forwardRequest(req, res, targetUrl);
  }

  @Post('auth/*')
  async anonymousAuth(@Req() req: Request, @Res() res: Response) {
    const targetUrl = `${process.env.AUTH_URL}${req.originalUrl}`;
    return this.forwardRequest(req, res, targetUrl);
  }
}
