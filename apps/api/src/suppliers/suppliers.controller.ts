import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto, AddContactDto, MapComponentDto } from './dtos';

@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Post()
  create(@Body() dto: CreateSupplierDto) {
    return this.suppliersService.create(dto);
  }

  @Get()
  findAll(@Query('search') search?: string) {
    return this.suppliersService.findAll(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.suppliersService.findOne(id);
  }

  @Post(':id/contacts')
  addContact(@Param('id') supplierId: string, @Body() dto: AddContactDto) {
    return this.suppliersService.addContact(supplierId, dto);
  }

  @Delete(':id/contacts/:contactId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeContact(
    @Param('id') supplierId: string,
    @Param('contactId') contactId: string,
  ) {
    return this.suppliersService.removeContact(supplierId, contactId);
  }

  @Post(':id/components')
  mapComponent(@Param('id') supplierId: string, @Body() dto: MapComponentDto) {
    return this.suppliersService.mapComponent(supplierId, dto);
  }

  @Delete(':id/components/:mappingId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeComponentMapping(
    @Param('id') supplierId: string,
    @Param('mappingId') mappingId: string,
  ) {
    return this.suppliersService.removeComponentMapping(supplierId, mappingId);
  }
}
