import {
  IsEnum,
  IsBoolean,
  IsString,
  Length,
  IsOptional,
} from 'class-validator';
import { UserRole } from '@app/auth/constants';

export class UserUpdateDto {
  @IsOptional()
  @IsString()
  @Length(4, 32)
  username: string;
  @IsOptional()
  @IsEnum(UserRole)
  role: number;
  @IsOptional()
  @IsBoolean()
  is_active: boolean;
}

