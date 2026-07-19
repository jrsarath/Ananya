import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import type { InventoryProjection } from '@ananya/inventory';
import { ProjectionService } from './projection.service';

@Controller('projections')
export class ProjectionController {
  constructor(private readonly projectionService: ProjectionService) {}

  @Get(':id')
  get(@Param('id') id: string): Promise<InventoryProjection | null> {
    return this.projectionService.getProjection(id);
  }

  @Get('by-component-location')
  getByComponentAndLocation(
    @Query('componentId') componentId: string,
    @Query('locationId') locationId: string,
  ): Promise<InventoryProjection | null> {
    return this.projectionService.getProjectionByComponentAndLocation(componentId, locationId);
  }

  @Get('by-component/:componentId')
  getByComponent(@Param('componentId') componentId: string): Promise<InventoryProjection[]> {
    return this.projectionService.getProjectionsByComponent(componentId);
  }

  @Get('by-location/:locationId')
  getByLocation(@Param('locationId') locationId: string): Promise<InventoryProjection[]> {
    return this.projectionService.getProjectionsByLocation(locationId);
  }

  @Post('recalculate')
  recalculate(
    @Body('componentId') componentId: string,
    @Body('locationId') locationId: string,
    @Body('transactions') transactions: any[],
  ): Promise<InventoryProjection> {
    return this.projectionService.recalculateProjection(componentId, locationId, transactions);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.projectionService.deleteProjection(id);
  }

  @Delete('by-component-location')
  deleteByComponentAndLocation(
    @Query('componentId') componentId: string,
    @Query('locationId') locationId: string,
  ): Promise<void> {
    return this.projectionService.deleteProjectionByComponentAndLocation(componentId, locationId);
  }
}
