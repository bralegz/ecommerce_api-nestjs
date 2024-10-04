import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { CategoriesRepository } from '../Categories/categories.repository';
import { seed as seedData } from '../seed/seed';
import { Product } from './products.entity';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly categoriesRepository: CategoriesRepository,
  ) {}

  async getProducts(page: number, limit: number) {
    const products = await this.productsRepository.getProducts(page, limit);
    return products;
  }

  async getProductById(id: string) {
    try {
      const product = await this.productsRepository.getProductById(id);
      return product;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: error.message,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async createProduct(
    newProduct: Omit<Product, 'category' | 'id' | 'imgUrl' | 'orderDetails'> & {
      category: string;
    },
  ) {
    try {
      //check if product exists
      const productExists = await this.productsRepository.getProductByName(
        newProduct.name,
      );

      if (productExists) {
        throw new ConflictException('Product already exists');
      }

      //find category in the database
      const category = await this.categoriesRepository.getCategoryByName(
        newProduct.category,
      );

      if (!category) {
        throw new ConflictException('Category does not exist');
      }

      //Define the default img url
      const defaultImgUrl = 'default-image-url.jpg';

      const createdProduct = await this.productsRepository.createProduct({
        ...newProduct,
        imgUrl: defaultImgUrl,
        category,
      });

      return createdProduct;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error; // re-throws the conflict exception so it can be handled;
      }
      console.error('Error creating product:', error);
      throw new BadRequestException('Failed to create product'); // If there was another kind of error it will throw a bad request exception
    }
  }

  async getProductByName(name: string) {
    try {
      const product = await this.productsRepository.getProductByName(name);

      if (!product) {
        throw new Error('Product not found');
      }

      return product;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async updateProduct(productId: string, updateProperties: Partial<Product>) {
    try {
      if (updateProperties.imgUrl) {
        throw new Error('You cannot modify the image url from here');
      }

      if (updateProperties.category) {
        throw new Error('You cannot modify the product category');
      }

      const modifiedProduct = await this.productsRepository.updateProduct(
        productId,
        updateProperties,
      );

      return modifiedProduct;
    } catch (error) {
      if (error.message === 'You cannot modify the image url from here') {
        throw new NotAcceptableException(error.message);
      }

      if (error.message === 'You cannot modify the product category') {
        throw new NotAcceptableException(error.message);
      }

      throw new NotFoundException(error.message);
    }
  }

  async deleteProduct(id: string): Promise<string> {
    try {
      const productDeleted = await this.productsRepository.deleteProduct(id);
      return productDeleted;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async seedProducts() {
    //1- Check if there are categories in the database
    //fetch all categories
    const categories = await this.categoriesRepository.getCategories();

    //check if the categories array is empty
    if (categories.length === 0) {
      return 'There are not categories in the database';
    }

    //2- Check there aren't products with the same name
    //fetch all existing products
    const existingProducts = await this.productsRepository.getAllProducts();
    //create an array with the product names
    const productNames = existingProducts.map((product) => product.name);
    //create a set to ensure there aren't products with the same name
    const productUniqueNames = new Set(productNames);

    //3- Add categories to products
    //create a map for categories for quick lookup
    const categoryMap = new Map(
      categories.map((category) => [category.name, category]),
    );

    //filter seed data to exclude products with existing names
    const filteredProducts = seedData.filter(
      (product) => !productUniqueNames.has(product.name),
    );

    //add categories
    const newProducts = filteredProducts.map((product) => {
      const category = categoryMap.get(product.category);
      return {
        ...product,
        category: category,
      };
    });

    const seed = await this.productsRepository.seedProducts(newProducts);

    return seed;
  }
}
