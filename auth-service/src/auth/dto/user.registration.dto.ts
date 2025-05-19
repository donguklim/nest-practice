import { ApiProperty } from '@nestjs/swagger';

export class UserRegistrationDto {
  @ApiProperty({
    description: 'username',
    example: 'securePassword123',
    minLength: 6,
    maxLength: 18,
  })
  username: string;
  @ApiProperty({
    description: 'username',
    example: 'securePassword123',
    minLength: 8,
    maxLength: 32,
  })
  password: string;
  @ApiProperty({
    description: 'username',
    example: 'securePassword123',
    minLength: 8,
    maxLength: 32,
  })
  re_password: string;
}
