import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { LocationsModule } from './locations/locations.module';
import { ComponentsModule } from './components/components.module';

@Module({
  imports: [LocationsModule, ComponentsModule],
  controllers: [AppController],
})
export class AppModule {}
