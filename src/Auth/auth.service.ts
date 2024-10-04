import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Users } from '../Users/users.entity';
import { LoginUserDto } from './dtos/LoginUser.dto';
import { UsersRepository } from '../Users/users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from './enums/roles.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(newUser: Partial<Users> & { confirmationPassword: string }) {
    const user = await this.usersRepository.getUserByEmail(newUser.email);

    if (user) {
      throw new BadRequestException('User already exists');
    }

    if (newUser.password !== newUser.confirmationPassword) {
      throw new BadRequestException('Passwords does not match');
    }

    //second parameter is salt rounds
    const hashedPassword = await bcrypt.hash(newUser.password, 10);
    if (!hashedPassword) {
      throw new BadRequestException('Password could not be hashed');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmationPassword, ...userWithoutConfirmationPassword } =
      newUser;
    try {
      const createdUser = await this.usersRepository.createUser({
        ...userWithoutConfirmationPassword,
        password: hashedPassword,
      });

      return createdUser;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'User could not be created',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async signIn(credentials: LoginUserDto) {
    const user = await this.usersRepository.getUserByEmail(credentials.email);

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    } else {
      const passwordIsValid = await bcrypt.compare(
        credentials.password,
        user.password,
      );
      if (!passwordIsValid) {
        throw new BadRequestException('Invalid credentials');
      }
    }

    //token payload
    const userPayload = {
      sub: user.id, // good practice
      id: user.id,
      email: user.email,
      roles: [user.isAdmin ? Role.Admin : Role.User],
    };

    //sign token with the payload
    const token = this.jwtService.sign(userPayload);

    return { success: 'User logged successfully', token };
  }
}
