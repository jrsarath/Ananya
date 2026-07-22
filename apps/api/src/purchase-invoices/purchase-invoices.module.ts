import { Module } from '@nestjs/common';
import { PurchaseInvoicesController } from './purchase-invoices.controller';
import {
  PurchaseInvoicesService,
  PURCHASE_INVOICE_REPOSITORY,
} from './purchase-invoices.service';
import { DrizzlePurchaseInvoiceRepository } from '../infrastructure/repositories/drizzle-purchase-invoice.repository';
import { PurchaseOrdersModule } from '../purchase-orders/purchase-orders.module';
import { GoodsReceiptsModule } from '../goods-receipts/goods-receipts.module';

@Module({
  imports: [PurchaseOrdersModule, GoodsReceiptsModule],
  controllers: [PurchaseInvoicesController],
  providers: [
    PurchaseInvoicesService,
    {
      provide: PURCHASE_INVOICE_REPOSITORY,
      useClass: DrizzlePurchaseInvoiceRepository,
    },
  ],
  exports: [PurchaseInvoicesService],
})
export class PurchaseInvoicesModule {}
