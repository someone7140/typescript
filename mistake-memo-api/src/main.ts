import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  // configの取得
  const configService = app.get(ConfigService);
  // CORSの設定
  app.enableCors({
    origin: configService.get<string>('FRONT_END_URL'),
  });
  await app.listen(3000);
}
bootstrap();
