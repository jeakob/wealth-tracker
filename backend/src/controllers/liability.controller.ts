import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { LiabilityService } from '../services/liability.service';
import { Liability } from '../entities/liability.entity';

import { NetWorthService } from '../services/networth.service';

@Controller('liabilities')
export class LiabilityController {
    constructor(
        private readonly liabilityService: LiabilityService,
        private readonly netWorthService: NetWorthService
    ) { }

    @Get()
    findAll() {
        return this.liabilityService.findAll();
    }

    @Post()
    async create(@Body() liability: Partial<Liability>) {
        const result = await this.liabilityService.create(liability);
        await this.netWorthService.updateTodaySnapshot();
        return result;
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() liability: Partial<Liability>) {
        const result = await this.liabilityService.update(+id, liability);
        await this.netWorthService.updateTodaySnapshot();
        return result;
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        const result = await this.liabilityService.remove(+id);
        await this.netWorthService.updateTodaySnapshot();
        return result;
    }
}
