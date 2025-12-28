import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../entities/user.entity';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get()
    async findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.findOne(id);
    }

    @Post()
    async create(@Body() body: { username: string; password: string; role?: UserRole }) {
        return this.usersService.create(body.username, body.password, body.role || UserRole.USER);
    }

    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: { username?: string; role?: UserRole; is_active?: boolean },
    ) {
        return this.usersService.update(id, body);
    }

    @Patch(':id/password')
    async changePassword(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: { password: string },
    ) {
        await this.usersService.changePassword(id, body.password);
        return { message: 'Password changed successfully' };
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        await this.usersService.delete(id);
        return { message: 'User deleted successfully' };
    }
}
