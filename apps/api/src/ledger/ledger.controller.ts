import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import type { InventoryTransaction } from '@ananya/inventory';
import { CreateInventoryTransactionDto } from './create-inventory-transaction.dto';
import { LedgerService } from './ledger.service';

@Controller('ledger')
export class LedgerController {
  constructor(private readonly ledgerService: LedgerService) {}

  @Post()
  create(@Body() input: CreateInventoryTransactionDto): Promise<InventoryTransaction> {
    return this.ledgerService.create(input);
  }

  @Get()
  getAll(
    @Query('componentId') componentId?: string,
    @Query('locationId') locationId?: string,
    @Query('transactionType') transactionType?: string,
    @Query('batchId') batchId?: string,
    @Query('serialId') serialId?: string,
    @Query('reservationId') reservationId?: string,
  ): Promise<InventoryTransaction[]> {
    return this.ledgerService.getAllTransactions({
      componentId,
      locationId,
      transactionType,
      batchId,
      serialId,
      reservationId,
    });
  }

  @Get(':id')
  get(@Param('id') id: string): Promise<InventoryTransaction> {
    return this.ledgerService.getTransaction(id);
  }
}
