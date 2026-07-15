import { InjectionToken } from '@nestjs/common';
import type { ManufacturerRepository } from '@ananya/inventory';

export const MANUFACTURER_REPOSITORY: InjectionToken<ManufacturerRepository> =
  Symbol('ManufacturerRepository');
