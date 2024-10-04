import { Module } from '@nestjs/common';
import { CloudinaryService } from '../Cloudinary/cloudinary.service';
import { FilesController } from './files.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../Products/products.entity';
import { Category } from '../Categories/categories.entity';
import { ProductsRepository } from '../Products/products.repository';
import { FilesService } from './files.service';
import { FilesRepository } from './files.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category])],
  controllers: [FilesController],
  providers: [
    CloudinaryService,
    ProductsRepository,
    FilesService,
    FilesRepository,
  ],
})
export class FilesModule {}
