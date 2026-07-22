import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { PurchaseInvoicesService } from './purchase-invoices.service';
import { CreatePurchaseInvoiceDto, AddPurchaseInvoiceLineDto } from './dtos';

@Controller('purchase-invoices')
export class PurchaseInvoicesController {
  constructor(private readonly invoicesService: PurchaseInvoicesService) {}

  @Post()
  create(@Body() dto: CreatePurchaseInvoiceDto) {
    return this.invoicesService.create(dto);
  }

  @Get()
  findAll(
    @Query('supplierId') supplierId?: string,
    @Query('purchaseOrderId') purchaseOrderId?: string,
  ) {
    return this.invoicesService.findAll(supplierId, purchaseOrderId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invoicesService.findOne(id);
  }

  @Post(':id/lines')
  addLine(@Param('id') id: string, @Body() dto: AddPurchaseInvoiceLineDto) {
    return this.invoicesService.addLine(id, dto);
  }

  @Post(':id/match')
  match(@Param('id') id: string) {
    return this.invoicesService.match(id);
  }

  @Post(':id/approve')
  approve(@Param('id') id: string) {
    return this.invoicesService.approve(id);
  }
}
