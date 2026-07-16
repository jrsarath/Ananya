import type { Component, CreateComponentInput } from './component';

export interface ComponentRepository {
  findById(id: string): Promise<Component | null>;
  findBySku(sku: string): Promise<Component | null>;
  findAll(): Promise<Component[]>;
  create(input: CreateComponentInput): Promise<Component>;
}
