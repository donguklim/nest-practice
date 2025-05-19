import {
  IsEnum,
  IsBoolean,
  IsString,
  Length,
  IsOptional,
} from 'class-validator';
import { Role } from '@app/auth/role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UserUpdateDto {
  @IsOptional()
  @IsString()
  @Length(4, 32)
  @ApiProperty()
  username: string;
  @IsOptional()
  @IsEnum(Role)
  @ApiProperty({
    description: 'role value: USER = 4, OPERATOR = 3, AUDITOR = 2, ADMIN = 1',
    example: 4,
  })
  role: number;
  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'is user active?',
    example: true,
  })
  is_active: boolean;
}
