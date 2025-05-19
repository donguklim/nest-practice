import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserRegistrationDto {
  @IsString()
  @Length(4, 32)
  @ApiProperty({
    description: 'username',
    example: 'securePassword123',
    minLength: 6,
    maxLength: 32,
  })
  username: string;
  @IsString()
  @Length(8, 32)
  @ApiProperty({
    description: 'password',
    example: 'securePassword123',
    minLength: 8,
    maxLength: 32,
  })
  password: string;
  @IsString()
  @Length(8, 32)
  @ApiProperty({
    description: 're-typed password',
    example: 'securePassword123',
    minLength: 8,
    maxLength: 32,
  })
  re_password: string;
}
