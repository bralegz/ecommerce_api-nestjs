import { Injectable } from '@nestjs/common';
import { Order } from './orders.entity';
import { In, MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../Users/users.entity';
import { Product } from '../Products/products.entity';
import { OrderDetail } from '../OrderDetails/orderDetails.entity';

@Injectable()
export class OrdersRepository {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,
  ) {}

  async addOrder(userId: string, productIds: string[]) {
    //find the user in the database
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    //get array of products that match the ids and with stock more than 0
    const products = await this.productRepository.findBy({
      id: In(productIds),
      stock: MoreThan(0),
    });

    //check if some products are out of stock
    if (productIds.length > products.length) {
      throw new Error('Some products are out of stock or not found');
    }

    //sum the total of the products prices and reduce the stock by 1
    let total = 0;
    products.forEach((product) => {
      total += Number(product.price);
      product.stock -= 1;
    });

    //save the products modifications in the database
    await this.productRepository.save(products);

    const order = this.orderRepository.create({ user, date: new Date() });
    await this.orderRepository.save(order);

    //create new order detail
    const orderDetail = new OrderDetail();
    orderDetail.price = total;
    orderDetail.order = order;
    orderDetail.products = products;
    await this.orderDetailRepository.save(orderDetail);

    order.orderDetail = orderDetail;
    await this.orderRepository.save(order);

    return `New Order generated: ${order.id}`;
  }

  async getOrder(orderId: string) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: {
        user: true,
        orderDetail: {
          products: true,
        },
      },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  }
}
