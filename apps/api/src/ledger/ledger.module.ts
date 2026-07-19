import { Module } from '@nestjs/common';
import { INVENTORY_TRANSACTION_REPOSITORY } from './ledger.tokens';
import { DrizzleInventoryTransactionRepository } from '../infrastructure/repositories/drizzle-inventory-transaction.repository';
import { LedgerController } from './ledger.controller';
import { LedgerService } from './ledger.service';

@Module({
  controllers: [LedgerController],
  providers: [
    LedgerService,
    {
      provide: INVENTORY_TRANSACTION_REPOSITORY,
      useClass: DrizzleInventoryTransactionRepository,
    },
  ],
  exports: [LedgerService],
})
export class LedgerModule {}
