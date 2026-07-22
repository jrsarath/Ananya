import { Module } from '@nestjs/common';
import { ProcurementReportingController } from './procurement-reporting.controller';
import { ProcurementReportingService } from './procurement-reporting.service';

@Module({
  controllers: [ProcurementReportingController],
  providers: [ProcurementReportingService],
  exports: [ProcurementReportingService],
})
export class ProcurementReportingModule {}
