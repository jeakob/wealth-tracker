import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from '../entities/asset.entity';
import { AssetController } from '../controllers/asset.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Asset])],
  controllers: [AssetController],
})
export class AssetModule {}
