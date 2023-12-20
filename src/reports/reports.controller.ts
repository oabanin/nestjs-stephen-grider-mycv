import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Patch,
  Param,
} from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/users.entity';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ReportDto } from './dtos/report.dto';
import { Query } from '@nestjs/common/decorators/http/route-params.decorator';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { AdminGuard } from '../guards/admin.guard';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Controller('reports')
export class ReportsController {
  constructor(private reportService: ReportsService) {}

  @Post()
  @Serialize(ReportDto) // Serialization (remove embedded user)
  @UseGuards(AuthGuard) //check if user id
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportService.create(body, user);
  }

  @Get('all')
  @UseGuards(AuthGuard) //check if user id
  findAll() {
    return this.reportService.findAll();
  }

  @Patch('/:id')
  @UseGuards(AuthGuard) //check if user id
  @UseGuards(AdminGuard) //check if user id
  approveReport(@Body() body: ApproveReportDto, @Param('id') id: string) {
    return this.reportService.changeApproval(id, body.approved);
  }

  @Get()
  createEstimate(@Query() query: GetEstimateDto) {
    return this.reportService.createEstimate(query);
  }
}
