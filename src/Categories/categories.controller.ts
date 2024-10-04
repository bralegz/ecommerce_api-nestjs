import { Controller, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiResponse({
    status: 201,
    description: 'Categories seeded successfully',
    schema: { example: 'Categories seeded successfully' },
  })
  @Post('seeder')
  async addCategories() {
    const categoriesAdded = await this.categoriesService.addCategories();
    return categoriesAdded;
  }
}
