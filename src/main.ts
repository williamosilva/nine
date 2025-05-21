import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Nine URL Shortener API')

    .setDescription(
      `RESTful API for URL shortening, user management and click tracking.

## Features

- User registration and authentication
- URL shortening (with or without authentication)
- Authenticated users can manage their own URLs
- Access counting for each shortened URL
- Soft deletes with timestamp

> Shortened URLs are limited to 6 characters. Authenticated users have URLs tied to their account.

Endpoints that require authentication use a Bearer token.

All timestamps follow ISO 8601 format.`,
    )
    .setVersion('1.0.0')
    .addTag('Auth', 'User authentication and registration')
    .addTag('Url', 'Shorten, update, delete, list and redirect URLs')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((err) => {
  console.error('Application failed to start', err);
  process.exit(1);
});
