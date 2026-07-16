import { ObjectId } from '@ananya/core';
import { InvalidManufacturerCodeError, InvalidManufacturerNameError } from './manufacturer.errors';

export interface ManufacturerProps {
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

export class Manufacturer {
  public readonly id: string;
  public readonly code: string;
  public readonly name: string;
  public readonly isActive: boolean;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  private constructor(props: ManufacturerProps) {
    this.id = props.id;
    this.code = props.code;
    this.name = props.name;
    this.isActive = props.isActive;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  public static create(input: CreateManufacturerInput): Manufacturer {
    // Normalize code: trim and lowercase
    const code = input.code.trim().toLowerCase();
    
    // Normalize name: trim
    const name = input.name.trim();

    // Validate code
    if (!code) {
      throw new InvalidManufacturerCodeError('Manufacturer code is required');
    }

    // Validate name
    if (!name) {
      throw new InvalidManufacturerNameError('Manufacturer name is required');
    }

    // Generate identity and timestamps
    const id = ObjectId.generate().value;
    const createdAt = new Date();
    const updatedAt = createdAt;

    return new Manufacturer({
      id,
      code,
      name,
      isActive: true, // Default to active
      createdAt,
      updatedAt
    });
  }
}