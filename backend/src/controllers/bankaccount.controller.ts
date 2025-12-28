import { Controller, Get, Post, Body, Delete, Param, Put } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BankAccount } from '../entities/bankaccount.entity';
import { Asset } from '../entities/asset.entity';

import { NetWorthService } from '../services/networth.service';

@Controller('bankaccounts')
export class BankAccountController {
  constructor(
    @InjectRepository(BankAccount)
    private readonly bankAccountRepo: Repository<BankAccount>,
    @InjectRepository(Asset)
    private readonly assetRepo: Repository<Asset>,
    private readonly netWorthService: NetWorthService,
  ) { }

  @Get()
  async findAll(): Promise<BankAccount[]> {
    return this.bankAccountRepo.find();
  }

  @Post()
  async create(@Body() body: { name: string; initialBalance: number; currency: string; initialDate?: string }): Promise<BankAccount> {
    const { name, initialBalance, currency, initialDate } = body;

    // Use provided date or default to today
    const assetDate = initialDate || new Date().toISOString();

    // Create sync asset
    const newAsset = this.assetRepo.create({
      name: name,
      type: 'Bank Account', // specific type for banks
      value: initialBalance,
      currency: currency || 'USD',
      date: assetDate,
    });
    const savedAsset = await this.assetRepo.save(newAsset);

    const account = this.bankAccountRepo.create({
      name,
      initialBalance,
      currentBalance: initialBalance,
      currency: currency || 'USD',
      initialDate: initialDate ? new Date(initialDate) : new Date(),
      assetId: savedAsset.id
    });
    const savedAccount = await this.bankAccountRepo.save(account);

    // Update net worth snapshots
    await this.netWorthService.updateTodaySnapshot(savedAsset);

    return savedAccount;
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() body: { name?: string; initialBalance?: number; currentBalance?: number; currency?: string; initialDate?: string }) {
    const account = await this.bankAccountRepo.findOne({ where: { id } });
    if (!account) return { error: 'Not found' };

    if (body.name !== undefined) account.name = body.name;
    if (body.initialBalance !== undefined) account.initialBalance = body.initialBalance;
    if (body.currentBalance !== undefined) account.currentBalance = body.currentBalance;
    if (body.currency !== undefined) account.currency = body.currency;
    if (body.initialDate !== undefined) account.initialDate = new Date(body.initialDate);

    await this.bankAccountRepo.save(account);

    let updatedAsset = null;
    if (account.assetId) {
      const asset = await this.assetRepo.findOne({ where: { id: account.assetId } });
      if (asset) {
        if (body.name !== undefined) asset.name = body.name;
        if (body.currentBalance !== undefined) asset.value = body.currentBalance;
        if (body.currency !== undefined) asset.currency = body.currency;
        if (body.initialDate !== undefined) asset.date = body.initialDate;

        updatedAsset = await this.assetRepo.save(asset);
      }
    }

    // Update net worth snapshots
    await this.netWorthService.updateTodaySnapshot(updatedAsset);

    return account;
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const account = await this.bankAccountRepo.findOne({ where: { id } });
    if (account) {
      if (account.assetId) {
        await this.assetRepo.delete(account.assetId);
      }
      await this.bankAccountRepo.remove(account);

      // Update net worth snapshots after deletion
      await this.netWorthService.updateTodaySnapshot();
    }
    return { deleted: true };
  }
}
