import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { LocationsModule } from './locations/locations.module';
import { ComponentsModule } from './components/components.module';
import { ManufacturersModule } from './manufacturers/manufacturers.module';

@Module({
  imports: [LocationsModule, ComponentsModule, ManufacturersModule],
  controllers: [AppController],
})
export class AppModule {}
