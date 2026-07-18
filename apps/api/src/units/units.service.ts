import { Inject, Injectable } from '@nestjs/common';
import {
  CreateUnit,
  type CreateUnitInput,
  type Unit,
  type UnitRepository,
  UnitNotFoundError,
} from '@ananya/inventory';
import { UNIT_REPOSITORY } from './unit.tokens';

@Injectable()
export class UnitsService {
  private readonly createUnit: CreateUnit;

  constructor(
    @Inject(UNIT_REPOSITORY)
    private readonly repository: UnitRepository,
  ) {
    this.createUnit = new CreateUnit(repository);
  }

  create(input: CreateUnitInput): Promise<Unit> {
    return this.createUnit.execute(input);
  }

  getAllUnits(): Promise<Unit[]> {
    return this.repository.findMany();
  }

  async getUnit(id: string): Promise<Unit> {
    const unit = await this.repository.findById(id);
    if (!unit) {
      throw new UnitNotFoundError(id);
    }
    return unit;
  }
}