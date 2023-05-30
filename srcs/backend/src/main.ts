import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { PrismaClientExceptionFilter } from './database/prisma-client-exception.filter';
import { WsExceptionFilter } from './utils/WsExceptionFileter';
import { HttpExceptionFilter } from './utils/uuid.validation';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(
    new WsExceptionFilter(),
    new HttpExceptionFilter(),
    new PrismaClientExceptionFilter()
  );
  app.use(cookieParser('secret'));
  app.enableCors({ credentials: true, origin: process.env.FRONTEND_BASE_URL });
  const config = new DocumentBuilder()
    .setTitle('Median')
    .setDescription('The Median API description')
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3001);
}
bootstrap();
