import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dtos/LoginUser.dto';
import { SignupUserDto } from '../Users/dtos/SignupUser.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiResponse({
    status: 400,
    description: 'There was a problem with the new user properties',
  })
  @ApiResponse({
    status: 201,
    description: 'User was created successfully',
    schema: {
      example: {
        name: 'Lisa Corillo',
        email: 'lisa@example.com',
        phone: 1234567,
        country: 'Brazil',
        address: '1234 Main St',
        city: 'São Paulo',
        id: '870b9243-b040-4db6-8d8c-1fa6b4635e77',
        isAdmin: false,
      },
    },
  })
  signUp(@Body() newUser: SignupUserDto) {
    const createdUser = this.authService.signUp(newUser);
    return createdUser;
  }

  @Post('signin')
  @ApiResponse({
    status: 201,
    description: 'User logged successfully',
    schema: {
      example: {
        success: 'User logged successfully',
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3NDhkMzFhNi01YTZmLTQ2NDctYWZhZC1iMGQ3ZmYyNzFmODUiLCJpZCI6Ijc0OGQzMWE2LTVhNmYtNDY0Ny1hZmFkLWIwZDdmZjI3MWY4NSIsImVtYWlsIjoibGlzYUBleGFtcGxlLmNvbSIsInJvbGVzIjpbImFkbWluIl0sImlhdCI6MTcyNzUzNDc4NywiZXhwIjoxNzI3NTM4Mzg3fQ.HLGbhzrHny9L5iA1SeNoqRCwjkmZKoPkx_4ApaJ0nQk',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid user credentials',
  })
  signIn(@Body() credentials: LoginUserDto) {
    if (!credentials.email || !credentials.password) {
      return 'Both email and password are required';
    }

    const response = this.authService.signIn(credentials);

    return response;
  }
}
