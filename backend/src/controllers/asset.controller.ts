import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { Asset } from '../entities/asset.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('assets')
export class AssetController {
  constructor(
    @InjectRepository(Asset)
    private assetRepo: Repository<Asset>,
  ) {}

  @Get()
  async findAll() {
    return this.assetRepo.find();
  }

  @Post()
  async create(@Body() asset: Partial<Asset>) {
    return this.assetRepo.save(asset);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() asset: Partial<Asset>) {
    await this.assetRepo.update(id, asset);
    return this.assetRepo.findOneBy({ id });
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.assetRepo.delete(id);
    return { deleted: true };
  }
}
