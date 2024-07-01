import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('/api');
  await app.listen(process.env.PORT);
  console.log(
    `Server is Successfully Running, and App is listening on port '${process.env.PORT}'`,
  );
}
bootstrap();
