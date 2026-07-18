import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { LocationsModule } from './locations/locations.module';
import { ComponentsModule } from './components/components.module';
import { ManufacturersModule } from './manufacturers/manufacturers.module';
import { UnitsModule } from './units/units.module';

@Module({
  imports: [LocationsModule, ComponentsModule, ManufacturersModule, UnitsModule],
  controllers: [AppController],
})
export class AppModule {}
