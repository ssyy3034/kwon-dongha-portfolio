import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { TimelineService } from './timeline.service';
import { TimelineQueryDto } from './dto/timeline-query.dto';

@ApiTags('Timeline')
@Controller('timeline')
@Public()
export class TimelineController {
  constructor(private timelineService: TimelineService) {}

  @Get()
  @ApiOperation({ summary: 'Get timeline events with filters' })
  findAll(@Query() query: TimelineQueryDto) {
    return this.timelineService.findAll(query);
  }
}
