// 8. scripts/create-admin.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@app/app.module';
import { AuthService } from '@app/auth/service';
import * as readline from 'readline';
import { UserRole } from '@app/auth/constants';
import { DuplicateUsernameError } from '@app/auth/errors';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const authService = app.get(AuthService);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Username: ', (username) => {
    rl.question('Password: ', async (password) => {
      try {
        await authService.registerUser(username, password, UserRole.ADMIN);
        console.log('Admin user created.');
      } catch (err) {
        if (err instanceof DuplicateUsernameError) {
          console.log('Failed to create user. username already exists!.');
        } else {
          throw err;
        }
      } finally {
        await app.close();
        rl.close();
      }
    });
  });
}

bootstrap();
