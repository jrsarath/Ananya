import { Body, Controller, Post } from '@nestjs/common';
import type { Location } from '@ananya/inventory';
import { CreateLocationDto } from './create-location.dto';
import { LocationsService } from './locations.service';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  create(@Body() input: CreateLocationDto): Promise<Location> {
    return this.locationsService.create(input);
  }
}
