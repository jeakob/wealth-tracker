import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { Asset } from '../entities/asset.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { NetWorthService } from '../services/networth.service';

@Controller('assets')
export class AssetController {
  constructor(
    @InjectRepository(Asset)
    private assetRepo: Repository<Asset>,
    private netWorthService: NetWorthService,
  ) { }

  @Get()
  async findAll() {
    return this.assetRepo.find();
  }

  @Post()
  async create(@Body() asset: Partial<Asset>) {
    const savedAsset = await this.assetRepo.save(asset);
    await this.netWorthService.updateTodaySnapshot(savedAsset);
    return savedAsset;
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() asset: Partial<Asset>) {
    await this.assetRepo.update(id, asset);
    const updatedAsset = await this.assetRepo.findOneBy({ id });
    await this.netWorthService.updateTodaySnapshot(updatedAsset);
    return updatedAsset;
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.assetRepo.delete(id);
    await this.netWorthService.updateTodaySnapshot();
    return { deleted: true };
  }
}
