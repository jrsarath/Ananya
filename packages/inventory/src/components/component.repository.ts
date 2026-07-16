import { Component } from './component';

export interface ComponentRepository {
  findById(id: string): Promise<Component | null>;
  findBySku(sku: string): Promise<Component | null>;
  findAll(): Promise<Component[]>;
  save(component: Component): Promise<Component>;
}
