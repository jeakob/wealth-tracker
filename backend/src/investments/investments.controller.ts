import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('investments')
@UseGuards(JwtAuthGuard)
export class InvestmentsController {
  @Get()
  findAll() {
    // TODO: Implement actual investment tracking per user
    // For now, return empty list to ensure no data leaks
    return [];
  }
}
