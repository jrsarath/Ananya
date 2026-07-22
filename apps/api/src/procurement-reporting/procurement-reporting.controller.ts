import { Controller, Get } from '@nestjs/common';
import { ProcurementReportingService } from './procurement-reporting.service';

@Controller('procurement/reporting')
export class ProcurementReportingController {
  constructor(private readonly reportingService: ProcurementReportingService) {}

  @Get('metrics')
  getMetrics() {
    return this.reportingService.getMetrics();
  }

  @Get('open-po-aging')
  getOpenPoAging() {
    return this.reportingService.getOpenPoAging();
  }
}
