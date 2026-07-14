import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { LocationsModule } from './locations/locations.module';

@Module({
  imports: [LocationsModule],
  controllers: [AppController],
})
export class AppModule {}
