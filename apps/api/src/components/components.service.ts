import { Inject, Injectable } from '@nestjs/common';
import {
  CreateComponent,
  type CreateComponentInput,
  type Component,
  type ComponentRepository,
  ComponentNotFoundError,
} from '@ananya/inventory';
import { COMPONENT_REPOSITORY } from './component.tokens';

@Injectable()
export class ComponentsService {
  private readonly createComponent: CreateComponent;

  constructor(
    @Inject(COMPONENT_REPOSITORY)
    private readonly repository: ComponentRepository,
  ) {
    this.createComponent = new CreateComponent(repository);
  }

  create(input: CreateComponentInput): Promise<Component> {
    return this.createComponent.execute(input);
  }

  getAllComponents(): Promise<Component[]> {
    return this.repository.findAll();
  }

  async getComponent(id: string): Promise<Component> {
    const component = await this.repository.findById(id);
    if (!component) {
      throw new ComponentNotFoundError(id);
    }
    return component;
  }
}
