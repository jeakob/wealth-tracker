import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Req, NotFoundException, ForbiddenException } from '@nestjs/common';
import { LiabilityService } from '../services/liability.service';
import { Liability } from '../entities/liability.entity';
import { NetWorthService } from '../services/networth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('liabilities')
@UseGuards(JwtAuthGuard)
export class LiabilityController {
    constructor(
        private readonly liabilityService: LiabilityService,
        private readonly netWorthService: NetWorthService
    ) { }

    @Get()
    findAll(@Req() req) {
        return this.liabilityService.findAll(req.user.id);
    }

    @Post()
    async create(@Req() req, @Body() liability: Partial<Liability>) {
        const result = await this.liabilityService.create(liability, req.user.id);
        await this.netWorthService.updateTodaySnapshot(undefined, req.user.id);
        return result;
    }

    @Put(':id')
    async update(@Req() req, @Param('id') id: string, @Body() liability: Partial<Liability>) {
        const result = await this.liabilityService.update(+id, liability, req.user.id);
        if (!result) throw new NotFoundException('Liability not found');

        await this.netWorthService.updateTodaySnapshot(undefined, req.user.id);
        return result;
    }

    @Delete(':id')
    async remove(@Req() req, @Param('id') id: string) {
        await this.liabilityService.remove(+id, req.user.id);
        await this.netWorthService.updateTodaySnapshot(undefined, req.user.id);
        return { deleted: true };
    }
}
