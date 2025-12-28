import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NetWorthSnapshot } from '../entities/networth.entity';
import { Asset } from '../entities/asset.entity';
import { NetWorthService } from '../services/networth.service';
import { NetWorthController } from '../controllers/networth.controller';

import { Liability } from '../entities/liability.entity';

@Module({
    imports: [TypeOrmModule.forFeature([NetWorthSnapshot, Asset, Liability])],
    providers: [NetWorthService],
    controllers: [NetWorthController],
    exports: [NetWorthService],
})
export class NetWorthModule { }
