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

  @ApiProperty()
  @IsDate()
  fromDate: Date;

  @ApiProperty()
  @IsDate()
  toDate: Date;

  @ApiProperty()
  @IsNumber()
  quantity: number;
}
