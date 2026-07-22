import { ObjectId } from "@ananya/core";
import {
  InvalidSupplierCodeError,
  InvalidSupplierNameError,
} from "./supplier.errors";

export interface SupplierContactProps {
  id: string;
  supplierId: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  role?: string | null;
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SupplierComponentProps {
  id: string;
  supplierId: string;
  componentId: string;
  vendorPartNumber: string;
  leadTimeDays: number;
  minimumOrderQuantity: number;
  orderMultiple: number;
  unitPrice: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SupplierProps {
  id: string;
  code: string;
  name: string;
  taxId?: string | null;
  paymentTerms: string;
  currency: string;
  rating: number;
  isActive: boolean;
  contacts?: SupplierContactProps[];
  components?: SupplierComponentProps[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSupplierInput {
  code: string;
  name: string;
  taxId?: string | null;
  paymentTerms?: string;
  currency?: string;
}

export class Supplier {
  public readonly id: string;
  public readonly code: string;
  public readonly name: string;
  public readonly taxId?: string | null;
  public readonly paymentTerms: string;
  public readonly currency: string;
  public readonly rating: number;
  public readonly isActive: boolean;
  public readonly contacts: SupplierContactProps[];
  public readonly components: SupplierComponentProps[];
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  private constructor(props: SupplierProps) {
    this.id = props.id;
    this.code = props.code;
    this.name = props.name;
    this.taxId = props.taxId;
    this.paymentTerms = props.paymentTerms;
    this.currency = props.currency;
    this.rating = props.rating;
    this.isActive = props.isActive;
    this.contacts = props.contacts ?? [];
    this.components = props.components ?? [];
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  public static create(input: CreateSupplierInput): Supplier {
    const code = input.code.trim().toUpperCase();
    const name = input.name.trim();

    if (!code) {
      throw new InvalidSupplierCodeError("Supplier code is required.");
    }
    if (!name) {
      throw new InvalidSupplierNameError("Supplier name is required.");
    }

    const id = ObjectId.generate().value;
    const createdAt = new Date();

    return new Supplier({
      id,
      code,
      name,
      taxId: input.taxId?.trim() ?? null,
      paymentTerms: input.paymentTerms?.trim() || "NET30",
      currency: input.currency?.trim() || "USD",
      rating: 5.0,
      isActive: true,
      contacts: [],
      components: [],
      createdAt,
      updatedAt: createdAt,
    });
  }

  public static rehydrate(props: SupplierProps): Supplier {
    return new Supplier(props);
  }
}
