import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LocationExceptionFilter } from './locations/location-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new LocationExceptionFilter());

  const port = process.env.PORT ?? 4000;

  await app.listen(port);

  console.log(`Ananya API running on http://localhost:${port}`);
}

void bootstrap();
