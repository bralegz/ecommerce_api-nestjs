import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dtos/CreateOrder.dto';
import { AuthGuard } from '../Auth/guards/AuthGuard.guard';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiBody({
    description: 'User ID and products ID',
    required: true,
    schema: {
      example: {
        userId: 'f80e1f62-e803-4105-acdf-eb8bbc3348f8',
        products: [
          {
            id: '296d88bd-0691-49a7-ba3b-a5628fcb4019',
          },
          {
            id: '88f21ade-650f-4075-9fd6-57d8e75e0b00',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Order generated successfully',
    schema: {
      example: 'New Order generated: e8b92a8e-d931-494e-88ed-84dc6b87df13',
    },
  })
  @ApiResponse({
    status: 400,
    description: 'User ID or Product IDs not correct',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async addOrder(@Body() newOrder: CreateOrderDto) {
    const productsId = newOrder.products.map((product) => product.id);

    const order = this.ordersService.addOrder(newOrder.userId, productsId);

    return order;
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Order retrieved successfully',
    schema: {
      example: {
        id: '0235e573-d778-4e3b-9bcd-74e99202e239',
        date: '2024-09-28T15:48:46.933Z',
        user: {
          id: '748d31a6-5a6f-4647-afad-b0d7ff271f85',
          name: 'Lila Corillo',
          email: 'lisa@example.com',
          password:
            '$2b$10$fbvTQRU0ZEf7nez07W4S7.I75G6tR6YNV6sCrRjtbgGXI1OUfqh/u',
          phone: 1234567892,
          country: 'United States',
          address: 'lila address correct',
          city: 'New York',
          isAdmin: true,
        },
        orderDetail: {
          id: 'e090e481-59f1-4385-bec6-1512c3f08dba',
          price: '479.89',
          products: [
            {
              id: '0c444340-9c2c-47e2-b0c0-d4e069e2199f',
              name: 'Samsung Galaxy S23',
              description: 'Just another product',
              price: '300.00',
              stock: 11,
              imgUrl:
                'https://res.cloudinary.com/dvsnmcjsd/image/upload/v1727536794/y3scez3o5p2lwfbylxhn.webp',
            },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid order id',
  })
  async getOrder(@Param('id', ParseUUIDPipe) orderId: string) {
    const order = this.ordersService.getOrder(orderId);
    return order;
  }
}
