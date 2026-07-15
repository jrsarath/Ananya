import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import type { Manufacturer } from '@ananya/inventory';
import { CreateManufacturerDto } from './create-manufacturer.dto';
import { ManufacturersService } from './manufacturers.service';

@Controller('manufacturers')
export class ManufacturersController {
  constructor(private readonly manufacturersService: ManufacturersService) {}

  @Post()
  create(@Body() input: CreateManufacturerDto): Promise<Manufacturer> {
    return this.manufacturersService.create(input);
  }

  @Get()
  getAll(): Promise<Manufacturer[]> {
    return this.manufacturersService.getAllManufacturers();
  }

  @Get(':id')
  get(@Param('id') id: string): Promise<Manufacturer> {
    return this.manufacturersService.getManufacturer(id);
  }
}
