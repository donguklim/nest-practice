import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsDate,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EventTypeEnum } from '@app/event/event.type.enum';

export class EventConditionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEnum(EventTypeEnum)
  eventType: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  targetCode: string;

  @ApiProperty({
    example: '2025-06-01T12:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  @Type(() => Date)
  @IsDate()
  fromDate: Date;

  @ApiProperty({
    example: '2025-06-01T12:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  @Type(() => Date)
  @IsDate()
  toDate: Date;

  @ApiProperty()
  @IsNumber()
  quantity: number;
}
