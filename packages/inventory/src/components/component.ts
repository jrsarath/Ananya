import { ObjectId } from '@ananya/core';
import { InvalidComponentSkuError, InvalidComponentNameError, InvalidUnitError } from './component.errors';

export interface ComponentProps {
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

export interface FindManyComponentsOptions {}

export class Component {
  public readonly id: string;
  public readonly sku: string;
  public readonly name: string;
  public readonly description?: string | null;
  public readonly manufacturerId?: string | null;
  public readonly categoryId?: string | null;
  public readonly defaultLocationId?: string | null;
  public readonly unit: string;
  public readonly isActive: boolean;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  private constructor(props: ComponentProps) {
    this.id = props.id;
    this.sku = props.sku;
    this.name = props.name;
    this.description = props.description;
    this.manufacturerId = props.manufacturerId;
    this.categoryId = props.categoryId;
    this.defaultLocationId = props.defaultLocationId;
    this.unit = props.unit;
    this.isActive = props.isActive;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  public static create(input: CreateComponentInput): Component {
    // Normalize SKU: trim and lowercase
    const sku = input.sku.trim().toLowerCase();
    
    // Normalize name: trim
    const name = input.name.trim();
    
    // Normalize unit: trim
    const unit = input.unit.trim();

    // Validate required fields
    if (!sku) {
      throw new InvalidComponentSkuError('SKU is required');
    }
    
    if (!name) {
      throw new InvalidComponentNameError('Name is required');
    }
    
    if (!unit) {
      throw new InvalidUnitError('Unit is required');
    }

    // Generate identity and timestamps
    const id = ObjectId.generate().value;
    const createdAt = new Date();
    const updatedAt = createdAt;

    return new Component({
      id,
      sku,
      name,
      description: input.description?.trim() ?? null,
      manufacturerId: input.manufacturerId ?? null,
      categoryId: input.categoryId ?? null,
      defaultLocationId: input.defaultLocationId ?? null,
      unit,
      isActive: true, // Default to active
      createdAt,
      updatedAt
    });
  }
}

