import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { SupplierReturnsService } from './supplier-returns.service';
import { CreateSupplierReturnDto, AddSupplierReturnLineDto } from './dtos';

@Controller('supplier-returns')
export class SupplierReturnsController {
  constructor(private readonly returnsService: SupplierReturnsService) {}

  @Post()
  create(@Body() dto: CreateSupplierReturnDto) {
    return this.returnsService.create(dto);
  }

  @Get()
  findAll(
    @Query('supplierId') supplierId?: string,
    @Query('status') status?: string,
  ) {
    return this.returnsService.findAll(supplierId, status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.returnsService.findOne(id);
  }

  @Post(':id/lines')
  addLine(@Param('id') id: string, @Body() dto: AddSupplierReturnLineDto) {
    return this.returnsService.addLine(id, dto);
  }

  @Post(':id/approve')
  approve(@Param('id') id: string, @Body('rmaNumber') rmaNumber?: string) {
    return this.returnsService.approve(id, rmaNumber);
  }

  @Post(':id/dispatch')
  dispatch(@Param('id') id: string) {
    return this.returnsService.dispatch(id);
  }
}
