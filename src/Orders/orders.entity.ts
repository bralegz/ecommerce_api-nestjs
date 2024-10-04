import { OrderDetail } from '../OrderDetails/orderDetails.entity';
import { Users as User } from '../Users/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  date: Date;

  //This will create a columnt called userId for a foreign key pointing at the users table.
  @ManyToOne(() => User, (user) => user.orders, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  //This entity (orders) already has a one to one relationship with orderDetails but it's not reflected here,
  @OneToOne(() => OrderDetail)
  @JoinColumn()
  orderDetail: OrderDetail;
}
