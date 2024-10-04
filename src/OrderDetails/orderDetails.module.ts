import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderDetail } from './orderDetails.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderDetail])],
  providers: [],
  controllers: [],
})
export class OrderDetailsModule {}
