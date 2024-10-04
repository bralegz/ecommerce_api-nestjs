import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrdersRepository } from './orders.repository';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async addOrder(userId: string, productIds: string[]) {
    try {
      const newOrder = await this.ordersRepository.addOrder(userId, productIds);
      return newOrder;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getOrder(orderId: string) {
    try {
      return await this.ordersRepository.getOrder(orderId);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
