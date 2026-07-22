import { ObjectId } from "@ananya/core";

export interface InventoryProjectionProps {
  id: string;
  componentId: string;
  locationId: string;
  quantity: number;
  unitOfMeasure: string;
  lastUpdated: Date;
}

export class InventoryProjection {
  private constructor(
    public readonly id: string,
    public readonly componentId: string,
    public readonly locationId: string,
    public readonly quantity: number,
    public readonly unitOfMeasure: string,
    public readonly lastUpdated: Date,
  ) {}

  static create(props: InventoryProjectionProps): InventoryProjection {
    return new InventoryProjection(
      props.id,
      props.componentId,
      props.locationId,
      props.quantity,
      props.unitOfMeasure,
      props.lastUpdated,
    );
  }

  static createFromTransaction(
    componentId: string,
    locationId: string,
    quantity: number,
    unitOfMeasure: string,
    transactionType: string,
    timestamp: Date,
  ): InventoryProjection {
    return new InventoryProjection(
      ObjectId.generate().value,
      componentId,
      locationId,
      quantity,
      unitOfMeasure,
      timestamp,
    );
  }

  // Getters for the properties
  getId(): string {
    return this.id;
  }

  getComponentId(): string {
    return this.componentId;
  }

  getLocationId(): string {
    return this.locationId;
  }

  getQuantity(): number {
    return this.quantity;
  }

  getUnitOfMeasure(): string {
    return this.unitOfMeasure;
  }

  getLastUpdated(): Date {
    return this.lastUpdated;
  }
}
