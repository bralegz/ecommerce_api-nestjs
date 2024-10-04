import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDecimal,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { CategoryEnum } from '../../Categories/enums/categories.enum';

export class ProductDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 80)
  @ApiProperty({
    description: 'The product name should be betweem 3 and 80 characters',
    example: 'Redragon3000',
  })
  name: string;

  @IsOptional()
  @IsString()
  @Length(10, 100)
  @ApiPropertyOptional({
    description:
      'The product description should be betweem 10 and 100 characters',
    example: 'The best keyboard in the world',
  })
  description: string;

  @IsNotEmpty()
  @IsDecimal({ decimal_digits: '2', force_decimal: true })
  @ApiProperty({
    description: 'The price must be a decimal',
    example: '100.00',
  })
  price: string;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({
    description: 'The stock must be an int number',
    example: '10',
  })
  stock: number;

  @IsNotEmpty()
  @IsEnum(CategoryEnum, {
    message:
      'Category must be one of the following: smartphone, monitor, keyboard, mouse',
  })
  @ApiProperty({
    description:
      'Category must be one of the following: smartphone, monitor, keyboard, mouse',
    example: 'keyboard',
  })
  category: string;
}
