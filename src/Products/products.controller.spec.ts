import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { JwtService } from '@nestjs/jwt';
import { Users } from '../Users/users.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('productsController', () => {
  let productsController: ProductsController;
  let mockProductsService: ProductsService;
  let mockJwtService: JwtService;
  const mockUsersRepository = {
    findOne: jest.fn().mockResolvedValue({
      id: '38f73e09-bb5a-4c05-b079-429d9d03bed5',
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'hashedpassword',
      phone: 1234567890,
      country: 'USA',
      address: '123 Main St',
      city: 'Anytown',
      isAdmin: false,
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: getRepositoryToken(Users),
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    productsController = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(productsController).toBeDefined();
  });
});
