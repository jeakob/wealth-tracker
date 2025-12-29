import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async findAll(): Promise<User[]> {
        return this.userRepository.find({
            select: ['id', 'username', 'role', 'is_active', 'created_at', 'updated_at'],
            order: { created_at: 'DESC' },
        });
    }

    async findOne(id: number): Promise<User> {
        const user = await this.userRepository.findOne({
            where: { id },
            select: ['id', 'username', 'role', 'is_active', 'created_at', 'updated_at'],
        });

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        return user;
    }

    async findByUsername(username: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { username } });
    }

    async create(username: string, password: string, role: UserRole = UserRole.USER): Promise<User> {
        const existingUser = await this.findByUsername(username);
        if (existingUser) {
            throw new ConflictException('Username already exists');
        }

        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        const user = this.userRepository.create({
            username,
            password_hash,
            role,
            is_active: true,
        });

        await this.userRepository.save(user);
        return this.findOne(user.id);
    }

    async update(id: number, updateData: Partial<User>): Promise<User> {
        const user = await this.findOne(id);

        // Don't allow updating password through this method
        const { password_hash, ...safeUpdateData } = updateData as any;

        Object.assign(user, safeUpdateData);
        await this.userRepository.save(user);

        return this.findOne(id);
    }

    async changePassword(id: number, newPassword: string): Promise<void> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        const saltRounds = 10;
        user.password_hash = await bcrypt.hash(newPassword, saltRounds);
        await this.userRepository.save(user);
    }

    async delete(id: number): Promise<void> {
        const user = await this.findOne(id);
        // Hard delete - @ManyToOne with cascade will handle related entities
        await this.userRepository.remove(user);
    }
}
