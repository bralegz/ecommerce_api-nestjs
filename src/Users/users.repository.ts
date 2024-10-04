import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  async getUsers(page: number = 1, limit: number = 5) {
    const [users] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit, //calculated position
      take: limit, // number of users in one page
    });

    const usersPublicProperties = users.map((user) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { isAdmin, password, ...usersNoRolesOrPassword } = user;

      return usersNoRolesOrPassword;
    });

    return usersPublicProperties;
  }

  async getUserById(id: string): Promise<Omit<Users, 'isAdmin' | 'password'>> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { orders: true },
    });

    if (!user) {
      throw new Error('User Not Found');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, isAdmin, ...userWithNoRoles } = user;

    return userWithNoRoles;
  }

  async createUser(user: Partial<Users>): Promise<Partial<Users>> {
    const newUser = this.userRepository.create({ ...user });
    if (!newUser) {
      throw new Error('User could not be created');
    }
    await this.userRepository.save(newUser);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userNoPassword } = newUser;
    return userNoPassword;
  }

  async updateUser(
    id: string,
    updateUserbody: Partial<Users>,
  ): Promise<{ message: string; user: Omit<Users, 'password'> }> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('User does not exist');
    }

    Object.assign(user, updateUserbody);
    await this.userRepository.save(user);

    const updatedUser = await this.userRepository.findOne({ where: { id } });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...updatedUserNoPassword } = updatedUser;

    return {
      message: 'User updated successfully',
      user: updatedUserNoPassword,
    };
  }

  async deleteUser(id: string): Promise<string> {
    const deletedUser = await this.userRepository.delete(id);

    if (deletedUser.affected === 0) {
      throw new Error('User not found');
    }

    return 'User deleted successfully';
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    return user;
  }
}
