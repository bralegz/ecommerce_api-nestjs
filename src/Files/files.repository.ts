import { Injectable } from '@nestjs/common';
import { ProductsRepository } from '../Products/products.repository';

@Injectable()
export class FilesRepository {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async uploadImage(productId: string, imgUrl: string) {
    const updateProductImage = await this.productsRepository.updateProduct(
      productId,
      {
        imgUrl,
      },
    );
    return updateProductImage;
  }
}
