import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from '@app/common/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(UserModule);
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors();
  await app.listen(3001);
}
bootstrap();
