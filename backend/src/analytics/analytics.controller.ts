import { Controller, Get, Headers, Query, UnauthorizedException } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

const ADMIN_KEY = process.env.ADMIN_KEY || '';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('stats')
  async getStats(
    @Headers('x-admin-key') adminKey: string,
    @Query('days') daysParam?: string,
  ) {
    this.validateAdminKey(adminKey);
    const days = parseInt(daysParam ?? '7', 10);
    return this.analyticsService.getStats(days);
  }

  @Get('trend')
  async getTrend(
    @Headers('x-admin-key') adminKey: string,
    @Query('days') daysParam?: string,
  ) {
    this.validateAdminKey(adminKey);
    const days = parseInt(daysParam ?? '7', 10);
    return this.analyticsService.getDailyTrend(days);
  }

  private validateAdminKey(key: string) {
    if (!ADMIN_KEY || key !== ADMIN_KEY) {
      throw new UnauthorizedException('Invalid admin key');
    }
  }
}
