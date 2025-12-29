import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async createUser(email: string, password: string): Promise<{ id: number; email: string }> {
    // Check if user already exists
    const existingUser = await this.userRepo.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash the password
    const password_hash = await bcrypt.hash(password, 10);

    // Create new user
    const user = this.userRepo.create({
      email,
      password_hash,
    });

    const savedUser = await this.userRepo.save(user);

    // Return user without password hash
    return {
      id: savedUser.id,
      email: savedUser.email,
    };
  }

  async getAllUsers(): Promise<{ id: number; email: string }[]> {
    const users = await this.userRepo.find();
    return users.map(u => ({ id: u.id, email: u.email }));
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }
}
