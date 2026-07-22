import { db } from '@ananya/database';
import {
  purchaseInvoices,
  purchaseInvoiceLines,
} from '@ananya/database/schema';
import { eq, desc, count } from '@ananya/database/query';
import type {
  PurchaseInvoiceRecord,
  PurchaseInvoiceLineRecord,
} from '@ananya/database/schema';
import {
  PurchaseInvoice,
  PurchaseInvoiceRepository,
  PurchaseInvoiceStatus,
  ThreeWayMatchStatus,
  FindManyPurchaseInvoicesOptions,
} from '@ananya/procurement';

function toDomain(
  row: PurchaseInvoiceRecord,
  lines: PurchaseInvoiceLineRecord[] = [],
): PurchaseInvoice {
  return PurchaseInvoice.rehydrate({
    id: row.id,
    invoiceNumber: row.invoiceNumber,
    vendorInvoiceNumber: row.vendorInvoiceNumber,
    supplierId: row.supplierId,
    purchaseOrderId: row.purchaseOrderId,
    goodsReceiptId: row.goodsReceiptId,
    status: row.status as PurchaseInvoiceStatus,
    matchStatus: row.matchStatus as ThreeWayMatchStatus,
    totalAmount: parseFloat(row.totalAmount),
    dueDate: row.dueDate,
    lines: lines.map((l) => ({
      id: l.id,
      purchaseInvoiceId: l.purchaseInvoiceId,
      componentId: l.componentId,
      quantityBilled: l.quantityBilled,
      unitPrice: parseFloat(l.unitPrice),
      lineTotal: parseFloat(l.lineTotal),
      createdAt: l.createdAt,
      updatedAt: l.updatedAt,
    })),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  });
}

export class DrizzlePurchaseInvoiceRepository implements PurchaseInvoiceRepository {
  async findById(id: string): Promise<PurchaseInvoice | null> {
    const [row] = await db
      .select()
      .from(purchaseInvoices)
      .where(eq(purchaseInvoices.id, id))
      .limit(1);

    if (!row) return null;

    const lines = await db
      .select()
      .from(purchaseInvoiceLines)
      .where(eq(purchaseInvoiceLines.purchaseInvoiceId, id));

    return toDomain(row, lines);
  }

  async findByInvoiceNumber(
    invoiceNumber: string,
  ): Promise<PurchaseInvoice | null> {
    const [row] = await db
      .select()
      .from(purchaseInvoices)
      .where(eq(purchaseInvoices.invoiceNumber, invoiceNumber.toUpperCase()))
      .limit(1);

    if (!row) return null;

    const lines = await db
      .select()
      .from(purchaseInvoiceLines)
      .where(eq(purchaseInvoiceLines.purchaseInvoiceId, row.id));

    return toDomain(row, lines);
  }

  async findMany(
    options?: FindManyPurchaseInvoicesOptions,
  ): Promise<PurchaseInvoice[]> {
    const query = db.select().from(purchaseInvoices);

    if (options?.supplierId) {
      query.where(eq(purchaseInvoices.supplierId, options.supplierId));
    }
    if (options?.purchaseOrderId) {
      query.where(
        eq(purchaseInvoices.purchaseOrderId, options.purchaseOrderId),
      );
    }

    const rows = await query.orderBy(desc(purchaseInvoices.createdAt));

    return Promise.all(
      rows.map(async (row) => {
        const lines = await db
          .select()
          .from(purchaseInvoiceLines)
          .where(eq(purchaseInvoiceLines.purchaseInvoiceId, row.id));
        return toDomain(row, lines);
      }),
    );
  }

  async save(invoice: PurchaseInvoice): Promise<void> {
    await db
      .insert(purchaseInvoices)
      .values({
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        vendorInvoiceNumber: invoice.vendorInvoiceNumber,
        supplierId: invoice.supplierId,
        purchaseOrderId: invoice.purchaseOrderId,
        goodsReceiptId: invoice.goodsReceiptId ?? null,
        status: invoice.status,
        matchStatus: invoice.matchStatus,
        totalAmount: invoice.totalAmount.toString(),
        dueDate: invoice.dueDate,
      })
      .onConflictDoUpdate({
        target: purchaseInvoices.id,
        set: {
          status: invoice.status,
          matchStatus: invoice.matchStatus,
          totalAmount: invoice.totalAmount.toString(),
          dueDate: invoice.dueDate,
          updatedAt: new Date(),
        },
      });

    for (const line of invoice.lines) {
      await db
        .insert(purchaseInvoiceLines)
        .values({
          id: line.id,
          purchaseInvoiceId: invoice.id,
          componentId: line.componentId,
          quantityBilled: line.quantityBilled,
          unitPrice: line.unitPrice.toString(),
          lineTotal: line.lineTotal.toString(),
        })
        .onConflictDoUpdate({
          target: purchaseInvoiceLines.id,
          set: {
            quantityBilled: line.quantityBilled,
            unitPrice: line.unitPrice.toString(),
            lineTotal: line.lineTotal.toString(),
            updatedAt: new Date(),
          },
        });
    }
  }

  async generateNextInvoiceNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const [result] = await db.select({ count: count() }).from(purchaseInvoices);
    const num = (Number(result?.count ?? 0) + 1).toString().padStart(4, '0');
    return `PI-${year}-${num}`;
  }
}
