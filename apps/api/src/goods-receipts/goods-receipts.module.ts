import { Module } from '@nestjs/common';
import { GoodsReceiptsController } from './goods-receipts.controller';
import {
  GoodsReceiptsService,
  GOODS_RECEIPT_REPOSITORY,
} from './goods-receipts.service';
import { DrizzleGoodsReceiptRepository } from '../infrastructure/repositories/drizzle-goods-receipt.repository';
import { InventoryTransactionsModule } from '../inventory-transactions/inventory-transactions.module';
import { InventoryProjectionsModule } from '../inventory-projections/inventory-projections.module';
import { PurchaseOrdersModule } from '../purchase-orders/purchase-orders.module';

@Module({
  imports: [
    InventoryTransactionsModule,
    InventoryProjectionsModule,
    PurchaseOrdersModule,
  ],
  controllers: [GoodsReceiptsController],
  providers: [
    GoodsReceiptsService,
    {
      provide: GOODS_RECEIPT_REPOSITORY,
      useClass: DrizzleGoodsReceiptRepository,
    },
  ],
  exports: [GoodsReceiptsService],
})
export class GoodsReceiptsModule {}
