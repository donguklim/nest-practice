import {
  Controller,
  Post as HttpPost,
  Get,
  Body,
  Param,
  Query,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiQuery, ApiOperation } from '@nestjs/swagger';
import { EventService } from '@app/event/event.service';
import { CreateEventDto } from '@app/event/dto/create-event.dto';
import { UpdateEventConditionsDto } from '@app/event/dto/update-conditions.dto';
import { EventConditionDto } from '@app/event/dto/condition.dto';

@ApiTags('Events')
@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @HttpPost()
  @ApiOperation({ summary: 'Create a event' })
  create(@Body() dto: CreateEventDto) {
    return this.eventService.create(dto);
  }

  @Get()
  @ApiQuery({
    name: 'cursor',
    required: false,
    description: 'Value of the last item for pagination',
  })
  @ApiQuery({
    name: 'size',
    required: false,
    type: Number,
    description: 'Page size (default: 10)',
  })
  @ApiQuery({ name: 'sort', enum: ['asc', 'desc'], required: false })
  @ApiQuery({
    name: 'sortBy',
    enum: ['title', 'startDate', 'endDate'],
    required: false,
  })
  @ApiOperation({
    summary: 'List posts with cursor-based pagination and dynamic sorting',
  })
  findPaginated(
    @Query('cursor') cursor?: string,
    @Query('size') size?: number,
    @Query('sort') sort?: 'asc' | 'desc',
    @Query('sortBy') sortBy?: 'title' | 'startDate' | 'endDate',
  ) {
    return this.eventService.findAllWithCursor({ cursor, size, sort, sortBy });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a event by ID' })
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(id);
  }

  @Patch(':id/disable')
  @ApiOperation({ summary: 'disable a event' })
  disable(@Param('id') id: string) {
    return this.eventService.disable(id);
  }
  @Patch(':id/enable')
  @ApiOperation({ summary: 'enable a event' })
  enable(@Param('id') id: string) {
    return this.eventService.enable(id);
  }

  @Patch(':id/conditions/reset')
  @ApiOperation({ summary: 'Reset conditions to empty array' })
  resetConditions(@Param('id') id: string) {
    return this.eventService.resetConditions(id);
  }

  @Patch(':id/conditions/append')
  @ApiOperation({ summary: 'Append a single condition' })
  appendComment(@Param('id') id: string, @Body() dto: EventConditionDto) {
    return this.eventService.appendCondition(id, dto);
  }

  @Patch(':id/conditions/replace')
  @ApiOperation({ summary: 'Replace all conditions with new list' })
  replaceComments(
    @Param('id') id: string,
    @Body() dto: UpdateEventConditionsDto,
  ) {
    return this.eventService.replaceComments(id, dto);
  }
}
