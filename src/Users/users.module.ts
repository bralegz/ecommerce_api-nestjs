import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users])], // We will be able to access the Users Repository from typeORM
  providers: [UsersService, UsersRepository],
  controllers: [UsersController],
})
export class UsersModule {}
