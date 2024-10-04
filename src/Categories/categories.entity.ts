import { Product } from '../Products/products.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'categories' })
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @OneToMany(() => Product, (product) => product.category)
  product: Product[]; //Property of Category that holds an array of Product instances. It represents a collection of products associated with a particular category.
  //In the products table a new column called categoryId will be created with a foregin key pointing to categories.
}
