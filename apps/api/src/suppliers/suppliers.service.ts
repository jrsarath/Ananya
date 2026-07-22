import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Supplier, SupplierRepository } from '@ananya/procurement';
import { CreateSupplierDto, AddContactDto, MapComponentDto } from './dtos';

export const SUPPLIER_REPOSITORY = 'SUPPLIER_REPOSITORY';

@Injectable()
export class SuppliersService {
  constructor(
    @Inject(SUPPLIER_REPOSITORY)
    private readonly supplierRepository: SupplierRepository,
  ) {}

  async create(dto: CreateSupplierDto): Promise<Supplier> {
    const existing = await this.supplierRepository.findByCode(dto.code);
    if (existing) {
      throw new ConflictException(
        `Supplier code "${dto.code}" already exists.`,
      );
    }

    const supplier = Supplier.create(dto);
    await this.supplierRepository.save(supplier);
    return supplier;
  }

  async findAll(search?: string): Promise<Supplier[]> {
    return this.supplierRepository.findMany({ search });
  }

  async findOne(id: string): Promise<Supplier> {
    const supplier = await this.supplierRepository.findById(id);
    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found.`);
    }
    return supplier;
  }

  async addContact(supplierId: string, dto: AddContactDto): Promise<void> {
    await this.findOne(supplierId);
    await this.supplierRepository.addContact({
      supplierId,
      ...dto,
    });
  }

  async removeContact(supplierId: string, contactId: string): Promise<void> {
    await this.findOne(supplierId);
    await this.supplierRepository.deleteContact(supplierId, contactId);
  }

  async mapComponent(supplierId: string, dto: MapComponentDto): Promise<void> {
    await this.findOne(supplierId);
    await this.supplierRepository.mapComponent({
      supplierId,
      ...dto,
    });
  }

  async removeComponentMapping(
    supplierId: string,
    mappingId: string,
  ): Promise<void> {
    await this.findOne(supplierId);
    await this.supplierRepository.removeComponentMapping(supplierId, mappingId);
  }
}
