import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [AuthModule, HttpModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
