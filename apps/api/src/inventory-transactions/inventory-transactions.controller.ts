import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { CreateInventoryTransactionDto } from './create-inventory-transaction.dto';
import { InventoryTransactionsService } from './inventory-transactions.service';

@Controller('inventory-transactions')
export class InventoryTransactionsController {
  constructor(private readonly service: InventoryTransactionsService) {}

  @Post()
  async create(@Body() dto: CreateInventoryTransactionDto) {
    return this.service.create(dto);
  }

  @Get()
  async findAll() {
    return this.service.getAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const tx = await this.service.getById(id);
    if (!tx) {
      throw new NotFoundException(
        `Inventory transaction with ID ${id} not found`,
      );
    }
    return tx;
  }
}
