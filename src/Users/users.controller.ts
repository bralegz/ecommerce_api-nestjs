import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../Auth/guards/AuthGuard.guard';
import { Users } from './users.entity';
import { Role } from '../Auth/enums/roles.enum';
import { Roles } from '../Auth/decorators/roles.decorator';
import { RolesGuard } from '../Auth/guards/Roles.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @Get()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiResponse({
    status: 200,
    schema: {
      example: [
        {
          id: '748d31a6-5a6f-4647-afad-b0d7ff271f85',
          name: 'Lila Corillo',
          email: 'lisa@example.com',
          phone: 1234567892,
          country: 'United States',
          address: 'lila address correct',
          city: 'New York',
        },
        {
          id: 'a1b2c3d4-5e6f-7890-abcd-ef1234567890',
          name: 'John Doe',
          email: 'john@example.com',
          phone: 9876543210,
          country: 'Canada',
          address: '123 Maple Street',
          city: 'Toronto',
        },
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Missing or not authorized token',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Number of the page to be shown',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of users to be shown per page',
  })
  getUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Req() req: Request & { user: any },
  ) {
    // console.log(req.user);
    return this.usersService.getUsers(Number(page), Number(limit));
  }

  @ApiBearerAuth()
  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'User has been successfully retrieved.',
    schema: {
      example: {
        id: '297fdcc1-be5d-474f-bf9b-bb0c40434281',
        name: 'Norton Choro',
        email: 'choro@example.com',
        phone: 1234567890,
        country: null,
        address: 'Another direction specified',
        city: null,
        orders: [],
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Missing or not authorized token',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid user ID',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @UseGuards(AuthGuard)
  getUserById(
    @Param('id', ParseUUIDPipe) id: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Req() req: Request & { user: any },
  ) {
    const user = this.usersService.getUserById(id);
    // console.log(req.user); // print the token payload
    return user;
  }

  @ApiBearerAuth()
  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiBody({
    description: 'User properties to update',
    required: true,
    schema: {
      example: {
        city: 'New York',
        country: 'United States',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
    schema: {
      example: {
        message: 'User updated successfully',
        user: {
          id: 'f679f867-0ebd-4b0c-852b-f156f89c8d0e',
          name: 'Mero Marcos',
          email: 'monetso@example.com',
          phone: 1234567890,
          country: null,
          address: 'Marcos Address 123457',
          city: null,
          isAdmin: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Missing or unauthorized token',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid user ID',
  })
  updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserBody: Partial<Users>,
    @Req() req: Request & { user: any },
  ) {
    if (Object.keys(updateUserBody).length === 0) {
      throw new BadRequestException('There must be a value to update');
    }

    const updatedUserId = this.usersService.updateUser(id, updateUserBody);
    console.log(req.user);
    return updatedUserId;
  }

  @ApiBearerAuth()
  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'The user was deleted successfully',
    schema: {
      example: 'User deleted successfully',
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Missing or not authorized token',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid user ID',
  })
  @UseGuards(AuthGuard)
  deleteUser(@Param('id', ParseUUIDPipe) id: string): Promise<string> {
    const deletedUserId = this.usersService.deleteUser(id);
    return deletedUserId;
  }
}
