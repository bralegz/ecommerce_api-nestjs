import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  IsOptional,
  IsEmpty,
} from 'class-validator';

export class SignupUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 80)
  @ApiProperty({
    description:
      'The name should not be empty, must be a string and must have between 3 and 80 characters',
    example: 'Lisa Corillo',
  })
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'The email should be a valid email',
    example: 'lisa@example.com',
  })
  email: string;

  /**
   * The password must be a strong password
   * @example l1sa@C0ri11o
   */
  @IsNotEmpty()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,15}$/,
    {
      message: 'Password too weak',
    },
  )
  password: string;

  /**
   * The confirmation password should match the password
   * @example l1sa@C0ri11o
   */
  @IsNotEmpty()
  confirmationPassword: string;

  @IsString()
  @Length(3, 80)
  @ApiProperty({
    description:
      'The address must be a string and must have between 3 and 80 characters',
    example: '1234 Main St',
  })
  address: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'The phone number must be a number',
    example: 1234567,
  })
  phone: number;

  @IsOptional()
  @IsString()
  @Length(5, 20)
  @ApiPropertyOptional({
    description:
      'The country should be a string and must have between 5 and 20 characters',
    example: 'Brazil',
  })
  country: string;

  @IsOptional()
  @IsString()
  @Length(5, 20)
  @ApiPropertyOptional({
    description:
      'The city should be a string and must have between 5 and 20 characters',
    example: 'São Paulo',
  })
  city: string;

  @IsEmpty()
  @ApiHideProperty()
  isAdmin?: boolean;
}
