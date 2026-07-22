import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { SupplierReturn, SupplierReturnRepository } from '@ananya/procurement';
import { CreateSupplierReturnDto, AddSupplierReturnLineDto } from './dtos';
import { InventoryTransactionsService } from '../inventory-transactions/inventory-transactions.service';
import { InventoryProjectionsService } from '../inventory-projections/inventory-projections.service';

export const SUPPLIER_RETURN_REPOSITORY = 'SUPPLIER_RETURN_REPOSITORY';

@Injectable()
export class SupplierReturnsService {
  constructor(
    @Inject(SUPPLIER_RETURN_REPOSITORY)
    private readonly returnRepository: SupplierReturnRepository,
    private readonly inventoryTransactionsService: InventoryTransactionsService,
    private readonly inventoryProjectionsService: InventoryProjectionsService,
  ) {}

  async create(dto: CreateSupplierReturnDto): Promise<SupplierReturn> {
    const returnNumber = await this.returnRepository.generateNextReturnNumber();
    const returnDoc = SupplierReturn.create({
      returnNumber,
      supplierId: dto.supplierId,
      purchaseOrderId: dto.purchaseOrderId,
      rmaNumber: dto.rmaNumber,
    });
    await this.returnRepository.save(returnDoc);
    return returnDoc;
  }

  async findAll(
    supplierId?: string,
    status?: string,
  ): Promise<SupplierReturn[]> {
    return this.returnRepository.findMany({ supplierId, status });
  }

  async findOne(id: string): Promise<SupplierReturn> {
    const returnDoc = await this.returnRepository.findById(id);
    if (!returnDoc) {
      throw new NotFoundException(`Supplier Return with ID ${id} not found.`);
    }
    return returnDoc;
  }

  async addLine(
    id: string,
    dto: AddSupplierReturnLineDto,
  ): Promise<SupplierReturn> {
    const returnDoc = await this.findOne(id);
    returnDoc.addLine(dto);
    await this.returnRepository.save(returnDoc);
    return returnDoc;
  }

  async approve(id: string, rmaNumber?: string): Promise<SupplierReturn> {
    const returnDoc = await this.findOne(id);
    returnDoc.approve(rmaNumber);
    await this.returnRepository.save(returnDoc);
    return returnDoc;
  }

  async dispatch(id: string): Promise<SupplierReturn> {
    const returnDoc = await this.findOne(id);
    if (returnDoc.status !== 'APPROVED') {
      throw new BadRequestException(
        'Supplier Return must be APPROVED before dispatch.',
      );
    }

    // 1. Log inventory ISSUE transactions for each line
    for (const line of returnDoc.lines) {
      await this.inventoryTransactionsService.create({
        transactionType: 'Issue',
        componentId: line.componentId,
        sourceLocationId: line.locationId,
        quantity: line.quantityReturned,
        unitOfMeasure: 'pcs',
        reference: returnDoc.returnNumber,
        reason: `Supplier Return dispatch (RMA: ${returnDoc.rmaNumber ?? 'N/A'})`,
        createdBy: 'SYSTEM',
        createdAt: new Date(),
      });
    }

    // 2. Mark dispatched
    returnDoc.dispatch();
    await this.returnRepository.save(returnDoc);

    // 3. Rebuild inventory stock projections
    await this.inventoryProjectionsService.rebuild();

    return returnDoc;
  }
}
