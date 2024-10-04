import { Order } from '../Orders/orders.entity';
import { Product } from '../Products/products.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity({ name: 'order_details' })
export class OrderDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  price: number;

  // A column called orderId will be created for a foreign key referencing to the orders table.
  @OneToOne(() => Order)
  @JoinColumn()
  order: Order;

  // It will create a join table to solve the many to many relationship
  @ManyToMany(() => Product, (product) => product.orderDetails)
  @JoinTable({ name: 'order_details_products' })
  products: Product[];
}
