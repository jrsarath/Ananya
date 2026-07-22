import { Inject, Injectable } from '@nestjs/common';
import {
  Serial,
  type CreateSerialInput,
  type SerialRepository,
} from '@ananya/inventory';
import { SERIAL_REPOSITORY } from './serial.tokens';

@Injectable()
export class SerialsService {
  constructor(
    @Inject(SERIAL_REPOSITORY)
    private readonly repository: SerialRepository,
  ) {}

  async create(input: CreateSerialInput): Promise<Serial> {
    const serial = Serial.create(input);
    return this.repository.save(serial);
  }

  async getByComponent(componentId: string): Promise<Serial[]> {
    return this.repository.findManyByComponent(componentId);
  }

  async getById(id: string): Promise<Serial | null> {
    return this.repository.findById(id);
  }
}
