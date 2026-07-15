import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import type { Component } from '@ananya/inventory';
import { CreateComponentDto } from './create-component.dto';
import { ComponentsService } from './components.service';

@Controller('components')
export class ComponentsController {
  constructor(private readonly componentsService: ComponentsService) {}

  @Post()
  create(@Body() input: CreateComponentDto): Promise<Component> {
    return this.componentsService.create(input);
  }

  @Get()
  getAll(): Promise<Component[]> {
    return this.componentsService.getAllComponents();
  }

  @Get(':id')
  get(@Param('id') id: string): Promise<Component> {
    return this.componentsService.getComponent(id);
  }
}
