import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Liability } from '../entities/liability.entity';
import { LiabilityService } from '../services/liability.service';
import { LiabilityController } from '../controllers/liability.controller';

import { NetWorthModule } from './networth.module';

@Module({
    imports: [TypeOrmModule.forFeature([Liability]), NetWorthModule],
    controllers: [LiabilityController],
    providers: [LiabilityService],
    exports: [LiabilityService, TypeOrmModule], // Export TypeOrmModule so other modules can use LiabilityRepo
})
export class LiabilityModule { }
