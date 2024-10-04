import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async addCategories() {
    const categoriesAdded = await this.categoriesRepository.addCategories();

    return categoriesAdded;
  }
}
