import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateReservationDto } from './create-reservation.dto';
import { ReservationsService } from './reservations.service';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly service: ReservationsService) {}

  @Post()
  async create(@Body() dto: CreateReservationDto) {
    return this.service.create({
      ...dto,
      expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
    });
  }

  @Get('available')
  async getAvailable(
    @Query('componentId') componentId: string,
    @Query('locationId') locationId: string,
  ) {
    return this.service.getAvailableQuantity(componentId, locationId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.getById(id);
  }

  @Patch(':id/fulfill')
  async fulfill(@Param('id') id: string) {
    return this.service.fulfill(id);
  }

  @Patch(':id/cancel')
  async cancel(@Param('id') id: string) {
    return this.service.cancel(id);
  }
}
