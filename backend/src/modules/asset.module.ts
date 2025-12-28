import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from '../entities/asset.entity';
import { AssetController } from '../controllers/asset.controller';
import { NetWorthModule } from './networth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Asset]),
    NetWorthModule
  ],
  controllers: [AssetController],
})
export class AssetModule { }
