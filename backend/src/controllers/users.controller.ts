import { Controller, Post, Body, Get, BadRequestException } from '@nestjs/common';
import { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() body: { email: string; password: string }) {
    if (!body.email || !body.password) {
      throw new BadRequestException('Email and password are required');
    }
    return this.usersService.createUser(body.email, body.password);
  }

  @Get()
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }
}
