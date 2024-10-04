import {
  IsNotEmpty,
  IsUUID,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

class ProductDto {
  @IsUUID()
  id: string;
}

export class CreateOrderDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ValidateNested({ each: true }) //It ensures that each item in the products array is validated against the rules defined in the ProductDto class.
  @ArrayMinSize(1) // It ensures that the products array contains at least one element.
  @Type(() => ProductDto) // It transforms each item in the products array into an instance of the ProductDto class. //This is useful for ensuring that the items in the array are properly typed and can be validated accordingly
  products: ProductDto[];
}
