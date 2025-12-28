import { Controller, Get, Post, Delete } from '@nestjs/common';
import { NetWorthService } from '../services/networth.service';

@Controller('net-worth')
export class NetWorthController {
    constructor(private readonly netWorthService: NetWorthService) { }

    @Get('snapshots')
    async getSnapshots() {
        return this.netWorthService.getAllSnapshots();
    }

    @Post('recalculate')
    async recalculate() {
        return this.netWorthService.updateTodaySnapshot();
    }
}
