import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import type { Unit } from '@ananya/inventory';
import { CreateUnitDto } from './create-unit.dto';
import { UnitsService } from './units.service';

@Controller('units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Post()
  create(@Body() input: CreateUnitDto): Promise<Unit> {
    return this.unitsService.create(input);
  }

  @Get()
  getAll(): Promise<Unit[]> {
    return this.unitsService.getAllUnits();
  }

  @Get(':id')
  get(@Param('id') id: string): Promise<Unit> {
    return this.unitsService.getUnit(id);
  }
}
