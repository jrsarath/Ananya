import { Module } from '@nestjs/common';
import { INVENTORY_TRANSACTION_REPOSITORY } from './inventory-transaction.tokens';
import { DrizzleInventoryTransactionRepository } from '../infrastructure/repositories/drizzle-inventory-transaction.repository';
import { InventoryTransactionsController } from './inventory-transactions.controller';
import { InventoryTransactionsService } from './inventory-transactions.service';

@Module({
  controllers: [InventoryTransactionsController],
  providers: [
    InventoryTransactionsService,
    {
      provide: INVENTORY_TRANSACTION_REPOSITORY,
      useClass: DrizzleInventoryTransactionRepository,
    },
  ],
  exports: [InventoryTransactionsService, INVENTORY_TRANSACTION_REPOSITORY],
})
export class InventoryTransactionsModule {}
