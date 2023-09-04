import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}
  @Get('report')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Dashboard report success',
  })
  @ApiOperation({
    summary: 'Dashboard report',
  })
  getTypeReportStatistics() {
    return this.dashboardService.getTypeReportStatistics();
  }
  @Get('user')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Dashboard user success',
  })
  @ApiOperation({
    summary: 'Dashboard user',
  })
  getUserByRoleStatistic() {
    return this.dashboardService.getUserByRoleStatistic();
  }
  @Get('topic')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Dashboard topic success',
  })
  @ApiOperation({
    summary: 'Dashboard topic',
  })
  getTopTopic() {
    return this.dashboardService.getTopTopic();
  }
  @Get(':type/:value')
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Dashboard posts and discuss by type [week, month, year] success',
  })
  @ApiOperation({
    summary: 'Dashboard posts and discuss by type [week, month, year]',
  })
  getStatisticsByPeriod(
    @Param('type') type: string, // 'week', 'month', or 'year'
    @Param('value') value: string,
  ) {
    return this.dashboardService.getStatisticsByPeriod(type, value);
  }
}
