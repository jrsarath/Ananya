import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import type { Batch, Serial, BatchStatus, SerialStatus } from '@ananya/inventory';
import { CreateBatchDto } from './create-batch.dto';
import { CreateSerialDto } from './create-serial.dto';
import { BatchSerialService } from './batch-serial.service';

@Controller('batch-serial')
export class BatchSerialController {
  constructor(private readonly batchSerialService: BatchSerialService) {}

  // Batch endpoints
  @Post('batches')
  createBatch(@Body() input: CreateBatchDto): Promise<Batch> {
    return this.batchSerialService.createBatch(input);
  }

  @Get('batches')
  getAllBatches(
    @Query('componentId') componentId?: string,
    @Query('locationId') locationId?: string,
    @Query('status') status?: BatchStatus,
    @Query('batchNumber') batchNumber?: string,
    @Query('supplierReference') supplierReference?: string,
  ): Promise<Batch[]> {
    return this.batchSerialService.getAllBatches({
      componentId,
      locationId,
      status,
      batchNumber,
      supplierReference,
    });
  }

  @Get('batches/:id')
  getBatch(@Param('id') id: string): Promise<Batch> {
    return this.batchSerialService.getBatch(id);
  }

  @Get('batches/by-number/:batchNumber')
  getBatchByNumber(@Param('batchNumber') batchNumber: string): Promise<Batch> {
    return this.batchSerialService.getBatchByNumber(batchNumber);
  }

  @Post('batches/:id/consume')
  consumeBatch(@Param('id') id: string, @Body('quantity') quantity: number): Promise<Batch> {
    return this.batchSerialService.consumeBatch(id, quantity);
  }

  @Post('batches/:id/quarantine')
  quarantineBatch(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @Body('quarantinedBy') quarantinedBy: string,
  ): Promise<Batch> {
    return this.batchSerialService.quarantineBatch(id, reason, quarantinedBy);
  }

  @Post('batches/:id/release-quarantine')
  releaseBatchFromQuarantine(@Param('id') id: string): Promise<Batch> {
    return this.batchSerialService.releaseBatchFromQuarantine(id);
  }

  @Post('batches/:id/expire')
  expireBatch(@Param('id') id: string): Promise<Batch> {
    return this.batchSerialService.expireBatch(id);
  }

  // Serial endpoints
  @Post('serials')
  createSerial(@Body() input: CreateSerialDto): Promise<Serial> {
    return this.batchSerialService.createSerial(input);
  }

  @Get('serials')
  getAllSerials(
    @Query('componentId') componentId?: string,
    @Query('locationId') locationId?: string,
    @Query('status') status?: SerialStatus,
    @Query('serialNumber') serialNumber?: string,
  ): Promise<Serial[]> {
    return this.batchSerialService.getAllSerials({
      componentId,
      locationId,
      status,
      serialNumber,
    });
  }

  @Get('serials/:id')
  getSerial(@Param('id') id: string): Promise<Serial> {
    return this.batchSerialService.getSerial(id);
  }

  @Get('serials/by-number/:serialNumber')
  getSerialByNumber(@Param('serialNumber') serialNumber: string): Promise<Serial> {
    return this.batchSerialService.getSerialByNumber(serialNumber);
  }

  @Post('serials/:id/consume')
  consumeSerial(@Param('id') id: string, @Body('consumedBy') consumedBy: string): Promise<Serial> {
    return this.batchSerialService.consumeSerial(id, consumedBy);
  }

  @Post('serials/:id/mark-lost')
  markSerialAsLost(@Param('id') id: string): Promise<Serial> {
    return this.batchSerialService.markSerialAsLost(id);
  }

  @Post('serials/:id/mark-damaged')
  markSerialAsDamaged(@Param('id') id: string): Promise<Serial> {
    return this.batchSerialService.markSerialAsDamaged(id);
  }

  @Post('serials/:id/quarantine')
  quarantineSerial(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @Body('quarantinedBy') quarantinedBy: string,
  ): Promise<Serial> {
    return this.batchSerialService.quarantineSerial(id, reason, quarantinedBy);
  }

  @Post('serials/:id/release-quarantine')
  releaseSerialFromQuarantine(@Param('id') id: string): Promise<Serial> {
    return this.batchSerialService.releaseSerialFromQuarantine(id);
  }
}
