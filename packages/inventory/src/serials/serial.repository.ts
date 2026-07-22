import type { Serial } from "./serial";

export interface SerialRepository {
  findById(id: string): Promise<Serial | null>;
  findBySerialNumber(
    componentId: string,
    serialNumber: string,
  ): Promise<Serial | null>;
  findManyByComponent(componentId: string): Promise<Serial[]>;
  save(serial: Serial): Promise<Serial>;
}
