import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { GoodsReceipt, GoodsReceiptRepository } from '@ananya/procurement';
import { CreateGoodsReceiptDto, AddGoodsReceiptLineDto } from './dtos';
import { InventoryTransactionsService } from '../inventory-transactions/inventory-transactions.service';
import { InventoryProjectionsService } from '../inventory-projections/inventory-projections.service';
import { PurchaseOrdersService } from '../purchase-orders/purchase-orders.service';

export const GOODS_RECEIPT_REPOSITORY = 'GOODS_RECEIPT_REPOSITORY';

@Injectable()
export class GoodsReceiptsService {
  constructor(
    @Inject(GOODS_RECEIPT_REPOSITORY)
    private readonly grRepository: GoodsReceiptRepository,
    private readonly inventoryTransactionsService: InventoryTransactionsService,
    private readonly inventoryProjectionsService: InventoryProjectionsService,
    private readonly purchaseOrdersService: PurchaseOrdersService,
  ) {}

  async create(dto: CreateGoodsReceiptDto): Promise<GoodsReceipt> {
    const grNumber = await this.grRepository.generateNextGrNumber();
    const gr = GoodsReceipt.create({
      grNumber,
      purchaseOrderId: dto.purchaseOrderId,
      supplierId: dto.supplierId,
      packingSlipNumber: dto.packingSlipNumber,
      receivedAt: dto.receivedAt ? new Date(dto.receivedAt) : new Date(),
    });
    await this.grRepository.save(gr);
    return gr;
  }

  async findAll(
    purchaseOrderId?: string,
    supplierId?: string,
  ): Promise<GoodsReceipt[]> {
    return this.grRepository.findMany({ purchaseOrderId, supplierId });
  }

  async findOne(id: string): Promise<GoodsReceipt> {
    const gr = await this.grRepository.findById(id);
    if (!gr) {
      throw new NotFoundException(`Goods Receipt with ID ${id} not found.`);
    }
    return gr;
  }

  async addLine(
    grId: string,
    dto: AddGoodsReceiptLineDto,
  ): Promise<GoodsReceipt> {
    const gr = await this.findOne(grId);
    gr.addLine({
      ...dto,
      expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : null,
    });
    await this.grRepository.save(gr);
    return gr;
  }

  async postReceipt(id: string): Promise<GoodsReceipt> {
    const gr = await this.findOne(id);
    if (gr.status !== 'DRAFT') {
      throw new BadRequestException(
        'Goods Receipt has already been processed.',
      );
    }

    const po = await this.purchaseOrdersService.findOne(gr.purchaseOrderId);

    // Process each receiving line item
    for (const line of gr.lines) {
      // 1. Record stock receipt in Inventory Ledger
      await this.inventoryTransactionsService.create({
        transactionType: 'Receipt',
        componentId: line.componentId,
        destinationLocationId: line.locationId,
        quantity: line.quantityReceived,
        unitOfMeasure: 'pcs',
        reference: gr.grNumber,
        reason: `Received against PO`,
        createdBy: 'SYSTEM',
        createdAt: gr.receivedAt,
      });

      // 2. Update PO line received quantity
      const poLine = po.lines.find((l) => l.id === line.poLineId);
      if (poLine) {
        poLine.quantityReceived += line.quantityReceived;
      }
    }

    // 3. Update PO status
    const allLinesFulfilled = po.lines.every(
      (l) => l.quantityReceived >= l.quantityOrdered,
    );
    po.status = allLinesFulfilled ? 'FULFILLED' : 'PARTIALLY_RECEIVED';
    await this.purchaseOrdersService.approve(po.id); // Save updated PO status

    // 4. Mark Goods Receipt completed
    gr.markCompleted();
    await this.grRepository.save(gr);

    // 5. Rebuild inventory stock projections
    await this.inventoryProjectionsService.rebuild();

    return gr;
  }
}
