import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './products.entity';
import { Repository } from 'typeorm';
import { Category } from '../Categories/categories.entity';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async getProducts(page: number = 1, limit: number = 5) {
    const [products] = await this.productRepository.findAndCount({
      skip: (page - 1) * limit, //calculated position
      take: limit, // number of users in one page
    });

    return products;
  }

  async getProductById(id: string) {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new Error('Product not found ');
    }

    return product;
  }

  async getProductByName(productName: string) {
    const product = await this.productRepository.findOne({
      where: { name: productName },
    });

    return product;
  }

  async createProduct(
    newProduct: Omit<Product, 'id' | 'orderDetails'>,
  ): Promise<Product> {
    const createdProduct = this.productRepository.create({ ...newProduct });

    if (!createdProduct) {
      throw new Error('Product could not be created');
    }

    await this.productRepository.save(createdProduct);

    return createdProduct;
  }

  async updateProduct(productId: string, updateProperties: Partial<Product>) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    Object.assign(product, updateProperties);
    await this.productRepository.save(product);

    return await this.productRepository.findBy({ id: productId });
  }

  async deleteProduct(id: string): Promise<string> {
    const deletedProduct = await this.productRepository.delete(id);

    if (deletedProduct.affected === 0) {
      throw new Error('Product could not be deleted');
    }
    return 'Product deleted successfully';
  }

  async getAllProducts() {
    const products = this.productRepository.find();
    return products;
  }

  async seedProducts(
    newProducts: Omit<Product, 'id' | 'imgUrl' | 'orderDetails'>[],
  ) {
    await this.productRepository.save(newProducts);
    return 'Products seeded successfully';
  }
}
