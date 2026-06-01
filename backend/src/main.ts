import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Permite que o frontend Angular acesse a API.
  app.enableCors();

  // Valida automaticamente os DTOs recebidos nas requisições.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove campos extras não declarados nos DTOs.
      transform: true, // Converte tipos automaticamente quando possível.
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
