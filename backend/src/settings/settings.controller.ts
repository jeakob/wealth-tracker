import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SettingsService } from './settings.service';

@Controller('settings')
@UseGuards(JwtAuthGuard)
export class SettingsController {
    constructor(private readonly settingsService: SettingsService) { }

    @Get()
    async getSettings(@Req() req) {
        return this.settingsService.findAll(req.user.id);
    }

    @Post()
    async updateSetting(@Req() req, @Body() body: { key: string; value: string }) {
        return this.settingsService.update(req.user.id, body.key, body.value);
    }
}
