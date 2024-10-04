import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../Users/users.repository';
import { Users } from '../Users/users.entity';
import { SignupUserDto } from '../Users/dtos/SignupUser.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

describe('authService', () => {
  let mockUsersRepository: Partial<UsersRepository>;
  let authService: AuthService;
  const mockUser: SignupUserDto = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'password123',
    confirmationPassword: 'password123',
    phone: 1234567890,
    country: 'USA',
    address: '123 Main St',
    city: 'Anytown',
  };

  const mockUserTest: Partial<Users> = {
    id: '38f73e09-bb5a-4c05-b079-429d9d03bed5',
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'password123',
    phone: 1234567890,
    country: 'USA',
    address: '123 Main St',
    city: 'Anytown',
  };

  const mockJwtService = {
    sign: (payload) => jwt.sign(payload, 'testsecret'),
  };
  beforeEach(async () => {
    mockUsersRepository = {
      getUserByEmail: () => Promise.resolve(undefined),
      createUser: (user: Partial<Users>): Promise<Partial<Users>> =>
        Promise.resolve({
          ...user,
          isAdmin: false,
          id: '38f73e09-bb5a-4c05-b079-429d9d03bed5',
        }),
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: UsersRepository, useValue: mockUsersRepository },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('Create an instance of AuthService', async () => {
    expect(authService).toBeDefined();
  });

  it('Signup user returns the created user with its id', async () => {
    const result = await authService.signUp(mockUser);
    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
  });

  it('signUp throws an error if the email is aleady in use', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    mockUsersRepository.getUserByEmail = (email: string) =>
      Promise.resolve(mockUserTest as Users);

    try {
      await authService.signUp(mockUser);
    } catch (error) {
      expect(error.message).toEqual('User already exists');
    }
  });

  it('signIn returns an error if password is invalid', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    mockUsersRepository.getUserByEmail = (email: string) =>
      Promise.resolve(mockUserTest as Users);

    try {
      await authService.signIn({
        email: mockUserTest.email,
        password: 'invalid password',
      });
    } catch (error) {
      expect(error.message).toEqual('Invalid credentials');
    }
  });

  it('singIn returns an error if user is not found', async () => {
    try {
      await authService.signIn({
        email: mockUserTest.email,
        password: mockUserTest.password,
      });
    } catch (error) {
      expect(error.message).toEqual('Invalid credentials');
    }
  });

  it('signIn return an object with a message and token if user is found and the password is valid', async () => {
    const mockUserVariant = {
      ...mockUserTest,
      password: await bcrypt.hash(mockUserTest.password, 10),
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    mockUsersRepository.getUserByEmail = (email: string) =>
      Promise.resolve(mockUserVariant as Users);

    const response = await authService.signIn({
      email: mockUserTest.email,
      password: mockUser.password,
    });

    expect(response).toBeDefined();
    expect(response.token).toBeDefined();
    expect(response.success).toEqual('User logged successfully');
  });
});
