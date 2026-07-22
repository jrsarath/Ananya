import { Injectable } from '@nestjs/common';
import { db } from '@ananya/database';
import {
  suppliers,
  purchaseOrders,
  goodsReceipts,
} from '@ananya/database/schema';
import { count, eq, sql } from '@ananya/database/query';

@Injectable()
export class ProcurementReportingService {
  async getMetrics() {
    const [supplierCount] = await db.select({ count: count() }).from(suppliers);
    const [poCount] = await db.select({ count: count() }).from(purchaseOrders);
    const [grCount] = await db.select({ count: count() }).from(goodsReceipts);

    const [totalSpend] = await db
      .select({
        total: sql<string>`COALESCE(SUM(grand_total), 0)`,
      })
      .from(purchaseOrders)
      .where(eq(purchaseOrders.status, 'FULFILLED'));

    return {
      activeSuppliersCount: Number(supplierCount?.count ?? 0),
      totalPurchaseOrdersCount: Number(poCount?.count ?? 0),
      completedGoodsReceiptsCount: Number(grCount?.count ?? 0),
      totalFulfilledSpend: parseFloat(totalSpend?.total ?? '0.00'),
    };
  }

  async getOpenPoAging() {
    const rows = await db
      .select({
        id: purchaseOrders.id,
        poNumber: purchaseOrders.poNumber,
        status: purchaseOrders.status,
        grandTotal: purchaseOrders.grandTotal,
        createdAt: purchaseOrders.createdAt,
        expectedDeliveryDate: purchaseOrders.expectedDeliveryDate,
      })
      .from(purchaseOrders)
      .where(
        sql`status IN ('SUBMITTED', 'APPROVED', 'ISSUED', 'PARTIALLY_RECEIVED')`,
      );

    return rows.map((r) => ({
      ...r,
      grandTotal: parseFloat(r.grandTotal),
    }));
  }
}
