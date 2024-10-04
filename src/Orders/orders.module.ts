import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './orders.entity';
import { OrdersRepository } from './orders.repository';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Users } from '../Users/users.entity';
import { OrderDetail } from '../OrderDetails/orderDetails.entity';
import { Product } from '../Products/products.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Users, OrderDetail, Product])],
  providers: [OrdersRepository, OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}
