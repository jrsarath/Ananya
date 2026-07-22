import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { InventoryProjectionsService } from './inventory-projections.service';

@Controller('inventory-projections')
export class InventoryProjectionsController {
  constructor(private readonly service: InventoryProjectionsService) {}

  @Get('query')
  async findByComponentAndLocation(
    @Query('componentId') componentId: string,
    @Query('locationId') locationId: string,
  ) {
    if (!componentId || !locationId) {
      throw new NotFoundException(
        'Both componentId and locationId are required',
      );
    }
    const projection = await this.service.getByComponentAndLocation(
      componentId,
      locationId,
    );
    if (!projection) {
      throw new NotFoundException(
        `Projection for component ${componentId} at location ${locationId} not found`,
      );
    }
    return projection;
  }

  @Get('component/:componentId')
  async findByComponent(@Param('componentId') componentId: string) {
    return this.service.getByComponent(componentId);
  }

  @Get('location/:locationId')
  async findByLocation(@Param('locationId') locationId: string) {
    return this.service.getByLocation(locationId);
  }

  @Post('rebuild')
  async rebuild() {
    await this.service.rebuild();
    return { message: 'Inventory projections rebuilt successfully' };
  }
}
