import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import type { Reservation, ReservationStatus } from '@ananya/inventory';
import { CreateReservationDto } from './create-reservation.dto';
import { ReservationsService } from './reservations.service';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  create(@Body() input: CreateReservationDto): Promise<Reservation> {
    return this.reservationsService.create(input);
  }

  @Get()
  getAll(
    @Query('componentId') componentId?: string,
    @Query('locationId') locationId?: string,
    @Query('status') status?: ReservationStatus,
    @Query('businessReference') businessReference?: string,
  ): Promise<Reservation[]> {
    return this.reservationsService.getAllReservations({
      componentId,
      locationId,
      status,
      businessReference,
    });
  }

  @Get(':id')
  get(@Param('id') id: string): Promise<Reservation> {
    return this.reservationsService.getReservation(id);
  }
}
