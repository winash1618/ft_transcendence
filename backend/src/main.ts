import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { PrismaClientExceptionFilter } from './prisma-client-exception/prisma-client-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser('secret'));
  app.enableCors({ credentials: true, origin: process.env.FRONTEND_BASE_URL });
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('Median')
    .setDescription('The Median API description')
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter());
  await app.listen(3001);
}
bootstrap();
