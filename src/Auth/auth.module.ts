import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersRepository } from '../Users/users.repository';
import { AuthGuard } from './guards/AuthGuard.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../Users/users.entity';
import { UsersService } from '../Users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  providers: [AuthService, UsersRepository, AuthGuard, UsersService],
  controllers: [AuthController],
})
export class AuthModule {}
