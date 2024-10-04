import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductsRepository } from './products.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './products.entity';
import { Category } from '../Categories/categories.entity';
import { CategoriesRepository } from '../Categories/categories.repository';
import { Users } from '../Users/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, Users])], //enable to use typeorm repository for Product entity
  providers: [ProductsService, ProductsRepository, CategoriesRepository],
  controllers: [ProductsController],
})
export class ProductsModule {}
