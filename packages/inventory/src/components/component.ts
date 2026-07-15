export interface Component {
  id: string;
  sku: string;
  name: string;
  description?: string | null;
  manufacturerId?: string | null;
  categoryId?: string | null;
  defaultLocationId?: string | null;
  unit: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateComponentInput {
  sku: string;
  name: string;
  description?: string | null;
  manufacturerId?: string | null;
  categoryId?: string | null;
  defaultLocationId?: string | null;
  unit: string;
}
