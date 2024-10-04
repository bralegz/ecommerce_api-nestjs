import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from '../Auth/guards/AuthGuard.guard';
import { Product } from './products.entity';
import { Roles } from '../Auth/decorators/roles.decorator';
import { Role } from '../Auth/enums/roles.enum';
import { RolesGuard } from '../Auth/guards/Roles.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProductDto } from './dtos/product.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  //GET MULTIPLE PRODUCTS
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Products retrieved successfully',
    schema: {
      example: [
        {
          id: '46d9d449-e2cd-4fbd-a59b-19230094b606',
          name: 'Iphone 15',
          description: 'The best smartphone in the world',
          price: '199.99',
          stock: 12,
          imgUrl: 'default-image-url.jpg',
        },
        {
          id: '0c444340-9c2c-47e2-b0c0-d4e069e2199f',
          name: 'Samsung Galaxy S23',
          description: 'The best smartphone in the world',
          price: '150.00',
          stock: 12,
          imgUrl: 'default-image-url.jpg',
        },
      ],
    },
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Number of the page to be shown',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of products to be shown per page',
  })
  getProducts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
  ) {
    return this.productsService.getProducts(Number(page), Number(limit));
  }
  //GET PRODUCT BY NAME
  @Get('byName')
  @ApiResponse({
    status: 200,
    description: 'Product retreived successfully',
    schema: {
      example: {
        id: '4a154870-b1b5-4785-83d8-7dca88785600',
        name: 'Motorola Edge 40',
        description: 'The best smartphone in the world',
        price: '179.89',
        stock: 12,
        imgUrl: 'default-image-url.jpg',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  getProductByName(@Query('name') name: string) {
    const product = this.productsService.getProductByName(name);

    return product;
  }

  //GET ONE PRODUCT
  @ApiBearerAuth()
  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Product retrieved successfully',
    schema: {
      example: {
        id: '46d9d449-e2cd-4fbd-a59b-19230094b606',
        name: 'Iphone 15',
        description: 'The best smartphone in the world',
        price: '199.99',
        stock: 12,
        imgUrl: 'default-image-url.jpg',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 400, description: 'Invalid id' })
  getProductById(@Param('id', ParseUUIDPipe) id: string) {
    const product = this.productsService.getProductById(id);
    return product;
  }

  //CREATE PRODUCT
  @Post()
  @ApiResponse({
    status: 201,
    description: 'Product was created successfully',
    schema: {
      example: {
        name: 'Redragon3000',
        description: 'The best keyboard in the world',
        price: 100,
        stock: 10,
        imgUrl: 'default-image-url.jpg',
        category: {
          id: '88fa0e42-4b1d-4bb6-9e43-7089585a0701',
          name: 'keyboard',
        },
        id: 'e1cbdbdf-ebc0-44e3-bf17-640a22a1b898',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Category does not exist' })
  @ApiResponse({ status: 409, description: 'Product already exists' })
  createProduct(@Body() newProduct: ProductDto) {
    const priceNumber = Number(newProduct.price);
    const createdProduct = this.productsService.createProduct({
      ...newProduct,
      price: priceNumber,
    });
    return createdProduct;
  }

  //UPDATE PRODUCT
  @Put(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiParam({ name: 'id', description: 'Product id' })
  @ApiBody({
    description: 'Product properties to update',
    required: true,
    schema: {
      example: {
        price: 300,
        description: 'Just another product',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
    schema: {
      example: [
        {
          id: '46d9d449-e2cd-4fbd-a59b-19230094b606',
          name: 'Iphone 15',
          description: 'Just another product',
          price: '300.00',
          stock: 12,
          imgUrl: 'default-image-url.jpg',
        },
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Missing or invalid token',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid product id',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  @ApiResponse({
    status: 406,
    description: 'Not acceptable modification',
  })
  updateProduct(
    @Body() updateProperties: Partial<Product>,
    @Param('id', ParseUUIDPipe) productId: string,
  ) {
    const updateProduct = this.productsService.updateProduct(
      productId,
      updateProperties,
    );
    return updateProduct;
  }

  //DELETE PRODUCT
  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Product deleted successfully',
    schema: { example: 'Product deleted successfully' },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid product id',
  })
  deleteProduct(@Param('id', ParseUUIDPipe) id: string) {
    const deletedProduct = this.productsService.deleteProduct(id);
    return deletedProduct;
  }

  //SEED PRODUCTS
  @Post('seeder')
  @ApiResponse({
    status: 201,
    description: 'Products seeded successfully',
    schema: { example: 'Products seeded successfully' },
  })
  seedProduct() {
    const seed = this.productsService.seedProducts();
    return seed;
  }
}
