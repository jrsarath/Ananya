import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { PurchaseOrdersService } from './purchase-orders.service';
import { CreatePurchaseOrderDto, AddPoLineDto } from './dtos';
import { PurchaseOrderStatus } from '@ananya/procurement';

@Controller('purchase-orders')
export class PurchaseOrdersController {
  constructor(private readonly poService: PurchaseOrdersService) {}

  @Post()
  create(@Body() dto: CreatePurchaseOrderDto) {
    return this.poService.create(dto);
  }

  @Get()
  findAll(
    @Query('supplierId') supplierId?: string,
    @Query('status') status?: PurchaseOrderStatus,
    @Query('search') search?: string,
  ) {
    return this.poService.findAll(supplierId, status, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.poService.findOne(id);
  }

  @Post(':id/lines')
  addLine(@Param('id') id: string, @Body() dto: AddPoLineDto) {
    return this.poService.addLine(id, dto);
  }

  @Post(':id/submit')
  submit(@Param('id') id: string) {
    return this.poService.submit(id);
  }

  @Post(':id/approve')
  approve(@Param('id') id: string) {
    return this.poService.approve(id);
  }

  @Post(':id/issue')
  issue(@Param('id') id: string) {
    return this.poService.issue(id);
  }

  @Post(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.poService.cancel(id);
  }
}
