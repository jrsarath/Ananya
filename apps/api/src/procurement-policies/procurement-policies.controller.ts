import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ProcurementPoliciesService } from './procurement-policies.service';
import { CreateProcurementPolicyDto } from './dtos';

@Controller('procurement-policies')
export class ProcurementPoliciesController {
  constructor(private readonly policiesService: ProcurementPoliciesService) {}

  @Post()
  create(@Body() dto: CreateProcurementPolicyDto) {
    return this.policiesService.create(dto);
  }

  @Get()
  findAll() {
    return this.policiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.policiesService.findOne(id);
  }
}
