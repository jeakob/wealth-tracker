import { Controller, Get, Post, Delete, UseGuards, Req } from '@nestjs/common';
import { NetWorthService } from '../services/networth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('net-worth')
@UseGuards(JwtAuthGuard)
export class NetWorthController {
    constructor(private readonly netWorthService: NetWorthService) { }

    @Get('snapshots')
    async getSnapshots(@Req() req) {
        return this.netWorthService.getAllSnapshots(req.user.id);
    }

    @Post('recalculate')
    async recalculate(@Req() req) {
        return this.netWorthService.updateTodaySnapshot(undefined, req.user.id);
    }

    @Delete('snapshots')
    async clearSnapshots(@Req() req) {
        return this.netWorthService.clearAllSnapshots(req.user.id);
    }
}
