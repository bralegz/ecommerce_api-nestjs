import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../Categories/categories.entity';
import { Repository } from 'typeorm';
import { seed as seedData } from '../seed/seed';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async getCategories(): Promise<Category[]> {
    const allCategories = await this.categoryRepository.find();
    return allCategories;
  }

  async getCategoryByName(name: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { name } });

    return category;
  }

  async addCategories() {
    const categories = seedData.map((product) => product.category);
    const uniqueCategories = [...new Set(categories)];

    for (const categoryName of uniqueCategories) {
      let category = await this.categoryRepository.findOne({
        where: { name: categoryName as string },
      });

      if (!category) {
        category = this.categoryRepository.create({
          name: categoryName as string,
        });
        await this.categoryRepository.save(category);
      }
    }

    return 'Categories added successfully';
  }
}
