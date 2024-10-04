import { Category } from '../Categories/categories.entity';
import { OrderDetail } from '../OrderDetails/orderDetails.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
} from 'typeorm';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number;

  @Column({ type: 'int', nullable: false })
  stock: number;

  @Column({
    type: 'varchar',
    default: 'default-image-url.jpg', // replace with the actual default image URL
    nullable: true,
  })
  imgUrl: string;

  @ManyToOne(() => Category, (category) => category.product, {
    nullable: false,
  })
  category: Category; // A new column will be created called categoryId for a foreign key pointing to categories table

  @ManyToMany(() => OrderDetail, (orderDetail) => orderDetail.products)
  orderDetails: OrderDetail[];
}
