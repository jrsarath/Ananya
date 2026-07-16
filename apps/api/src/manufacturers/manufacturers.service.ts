import { Inject, Injectable } from '@nestjs/common';
import {
  CreateManufacturer,
  type CreateManufacturerInput,
  type Manufacturer,
  type ManufacturerRepository,
  ManufacturerNotFoundError,
} from '@ananya/inventory';
import { MANUFACTURER_REPOSITORY } from './manufacturer.tokens';

@Injectable()
export class ManufacturersService {
  private readonly createManufacturer: CreateManufacturer;

  constructor(
    @Inject(MANUFACTURER_REPOSITORY)
    private readonly repository: ManufacturerRepository,
  ) {
    this.createManufacturer = new CreateManufacturer(repository);
  }

  create(input: CreateManufacturerInput): Promise<Manufacturer> {
    return this.createManufacturer.execute(input);
  }

  getAllManufacturers(): Promise<Manufacturer[]> {
    return this.repository.findMany();
  }

  async getManufacturer(id: string): Promise<Manufacturer> {
    const manufacturer = await this.repository.findById(id);
    if (!manufacturer) {
      throw new ManufacturerNotFoundError(id);
    }
    return manufacturer;
  }
}
