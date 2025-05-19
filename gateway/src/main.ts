import { NestFactory } from '@nestjs/core';
import { AppModule } from '@app/app.module';
import * as SwaggerUi from 'swagger-ui-express';
import * as YAML from 'yamljs';
import { join } from 'path';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  const swaggerDocument = YAML.load(
    join(__dirname, '..', 'swagger.yaml'),
  );
  app.use('/swagger', SwaggerUi.serve, SwaggerUi.setup(swaggerDocument));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
