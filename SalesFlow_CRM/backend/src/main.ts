import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import * as session from 'express-session';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const isProduction =
    config.get<string>('NODE_ENV') === 'production';

  // Required when running behind Render/Vercel proxy
  if (isProduction) {
    app.getHttpAdapter().getInstance().set('trust proxy', 1);
  }

  app.enableCors({
    origin:
      config.get<string>('FRONTEND_URL') ||
      'http://localhost:3200',
    credentials: true,
  });

  app.use(
    session({
      secret:
        config.get<string>('SESSION_SECRET') ||
        'development-secret-change-me',

      resave: false,
      saveUninitialized: false,

      cookie: {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 8,
      },
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const port = Number(config.get('PORT', 3001));

  await app.listen(port, '0.0.0.0');

  console.log(`CRM backend running on port ${port}`);
}

bootstrap();