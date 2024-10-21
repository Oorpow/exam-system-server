import { NestFactory } from '@nestjs/core';
import { ExamModule } from './exam.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(ExamModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      // NOTE 使用::标识，以帮助ipv6连接 ipv4使用(0.0.0.0)
      host: '::',
      port: 8888,
    },
  });

  await app.listen(3002);

  // 开启微服务
  await app.startAllMicroservices();
}
bootstrap();