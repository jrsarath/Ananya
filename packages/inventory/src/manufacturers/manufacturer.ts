export interface Manufacturer {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateManufacturerInput {
  code: string;
  name: string;
}