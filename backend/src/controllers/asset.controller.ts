import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Asset } from '../entities/asset.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { NetWorthService } from '../services/networth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('assets')
@UseGuards(JwtAuthGuard)
export class AssetController {
  constructor(
    @InjectRepository(Asset)
    private assetRepo: Repository<Asset>,
    private netWorthService: NetWorthService,
  ) { }

  @Get()
  async findAll(@Req() req) {
    return this.assetRepo.find({
      where: { user_id: req.user.id }
    });
  }

  @Post()
  async create(@Req() req, @Body() asset: Partial<Asset>) {
    const newAsset = this.assetRepo.create({
      ...asset,
      user_id: req.user.id
    });
    const savedAsset = await this.assetRepo.save(newAsset);
    await this.netWorthService.updateTodaySnapshot(savedAsset, req.user.id);
    return savedAsset;
  }

  @Put(':id')
  async update(@Req() req, @Param('id') id: number, @Body() asset: Partial<Asset>) {
    const existingAsset = await this.assetRepo.findOne({ where: { id } });

    if (!existingAsset) {
      throw new NotFoundException('Asset not found');
    }

    if (existingAsset.user_id !== req.user.id) {
      throw new ForbiddenException('You do not have permission to update this asset');
    }

    await this.assetRepo.update(id, asset);
    const updatedAsset = await this.assetRepo.findOneBy({ id });
    await this.netWorthService.updateTodaySnapshot(updatedAsset, req.user.id);
    return updatedAsset;
  }

  @Delete(':id')
  async remove(@Req() req, @Param('id') id: number) {
    const existingAsset = await this.assetRepo.findOne({ where: { id } });

    if (!existingAsset) {
      throw new NotFoundException('Asset not found');
    }

    if (existingAsset.user_id !== req.user.id) {
      throw new ForbiddenException('You do not have permission to delete this asset');
    }

    await this.assetRepo.delete(id);
    await this.netWorthService.updateTodaySnapshot(undefined, req.user.id);
    return { deleted: true };
  }
}
