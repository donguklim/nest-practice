// dto/update-comments.dto.ts
import { Type } from 'class-transformer';
import { ValidateNested, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EventConditionDto } from '@app/event/dto/condition.dto';

export class UpdateEventConditionsDto {
  @ApiProperty({ type: [EventConditionDto] })
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => EventConditionDto)
  comments: EventConditionDto[];
}
