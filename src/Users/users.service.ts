import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { Users } from './users.entity';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getUsers(page: number, limit: number) {
    try {
      const dbUsers = await this.usersRepository.getUsers(page, limit);
      return dbUsers;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'There was an error getting the users',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserById(
    id: string,
  ): Promise<Omit<Users, 'isAdmin' | 'password'> | Error> {
    try {
      const user = await this.usersRepository.getUserById(id);

      return user;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async updateUser(
    id: string,
    updateUserBody: Partial<Users>,
  ): Promise<{ message: string; user: Omit<Users, 'password'> }> {
    try {
      const updatedUserId = await this.usersRepository.updateUser(
        id,
        updateUserBody,
      );

      return updatedUserId;
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: err.message,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async deleteUser(id: string): Promise<string> {
    try {
      const deletedUserId = await this.usersRepository.deleteUser(id);
      return deletedUserId;
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: err.message,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
