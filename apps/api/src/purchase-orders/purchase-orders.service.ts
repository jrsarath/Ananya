import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  PurchaseOrder,
  PurchaseOrderRepository,
  PurchaseOrderStatus,
} from '@ananya/procurement';
import { CreatePurchaseOrderDto, AddPoLineDto } from './dtos';

export const PURCHASE_ORDER_REPOSITORY = 'PURCHASE_ORDER_REPOSITORY';

@Injectable()
export class PurchaseOrdersService {
  constructor(
    @Inject(PURCHASE_ORDER_REPOSITORY)
    private readonly poRepository: PurchaseOrderRepository,
  ) {}

  async create(dto: CreatePurchaseOrderDto): Promise<PurchaseOrder> {
    const poNumber = await this.poRepository.generateNextPoNumber();
    const po = PurchaseOrder.create({
      poNumber,
      supplierId: dto.supplierId,
      currency: dto.currency,
      notes: dto.notes,
      expectedDeliveryDate: dto.expectedDeliveryDate
        ? new Date(dto.expectedDeliveryDate)
        : null,
    });
    await this.poRepository.save(po);
    return po;
  }

  async findAll(
    supplierId?: string,
    status?: PurchaseOrderStatus,
    search?: string,
  ): Promise<PurchaseOrder[]> {
    return this.poRepository.findMany({ supplierId, status, search });
  }

  async findOne(id: string): Promise<PurchaseOrder> {
    const po = await this.poRepository.findById(id);
    if (!po) {
      throw new NotFoundException(`Purchase Order with ID ${id} not found.`);
    }
    return po;
  }

  async addLine(poId: string, dto: AddPoLineDto): Promise<PurchaseOrder> {
    const po = await this.findOne(poId);
    po.addLine(dto);
    await this.poRepository.save(po);
    return po;
  }

  async submit(id: string): Promise<PurchaseOrder> {
    const po = await this.findOne(id);
    po.submit();
    await this.poRepository.save(po);
    return po;
  }

  async approve(id: string): Promise<PurchaseOrder> {
    const po = await this.findOne(id);
    po.approve();
    await this.poRepository.save(po);
    return po;
  }

  async issue(id: string): Promise<PurchaseOrder> {
    const po = await this.findOne(id);
    po.issue();
    await this.poRepository.save(po);
    return po;
  }

  async cancel(id: string): Promise<PurchaseOrder> {
    const po = await this.findOne(id);
    po.cancel();
    await this.poRepository.save(po);
    return po;
  }
}
