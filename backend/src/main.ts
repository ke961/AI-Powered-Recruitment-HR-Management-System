import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import express from 'express';
import { join } from 'path';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global API prefix
  app.setGlobalPrefix('api');

  // CORS configuration
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global DTO Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Serve static files from /uploads
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  // Swagger OpenAPI Documentation setup
  const config = new DocumentBuilder()
    .setTitle('HireFlow AI API')
    .setDescription(
      'Enterprise Recruitment & HR Management System API with Explainable AI Resume Screening, Kanban Pipeline, Interview Scorecards, and Offer Management.',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`\n🚀 HireFlow AI Backend is running on: http://localhost:${port}/api`);
  console.log(`📖 Swagger API Documentation is available at: http://localhost:${port}/api/docs\n`);
}

await bootstrap();
