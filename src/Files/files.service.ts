import { Injectable, NotFoundException } from '@nestjs/common';
import { FilesRepository } from './files.repository';
import { CloudinaryService } from '../Cloudinary/cloudinary.service';
import { Repository } from 'typeorm';
import { Product } from '../Products/products.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FilesService {
  constructor(
    private readonly filesRepository: FilesRepository,
    private readonly cloudinaryService: CloudinaryService,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async uploadImage(productId: string, file: Express.Multer.File) {
    try {
      const product = await this.productRepository.findOne({
        where: { id: productId },
      });

      if (!product) {
        throw new NotFoundException('Product could not be found');
      }

      const uploadedFile = await this.cloudinaryService.uploadImage(file); //propery with the url is called 'secure_url'
      // console.log(uploadedFile);

      const uploadImg = await this.filesRepository.uploadImage(
        productId,
        uploadedFile.secure_url,
      );

      return uploadImg;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
