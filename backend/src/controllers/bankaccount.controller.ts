import { Controller, Get, Post, Body, Delete, Param, Put, UseGuards, Req, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BankAccount } from '../entities/bankaccount.entity';
import { Asset } from '../entities/asset.entity';
import { NetWorthService } from '../services/networth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('bankaccounts')
@UseGuards(JwtAuthGuard)
export class BankAccountController {
  constructor(
    @InjectRepository(BankAccount)
    private readonly bankAccountRepo: Repository<BankAccount>,
    @InjectRepository(Asset)
    private readonly assetRepo: Repository<Asset>,
    private readonly netWorthService: NetWorthService,
  ) { }

  @Get()
  async findAll(@Req() req): Promise<BankAccount[]> {
    return this.bankAccountRepo.find({
      where: { user_id: req.user.id }
    });
  }

  @Post()
  async create(@Req() req, @Body() body: { name: string; initialBalance: number; currency: string; initialDate?: string }): Promise<BankAccount> {
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
      user_id: req.user.id
    });
    const savedAsset = await this.assetRepo.save(newAsset);

    const account = this.bankAccountRepo.create({
      name,
      initialBalance,
      currentBalance: initialBalance,
      currency: currency || 'USD',
      initialDate: initialDate ? new Date(initialDate) : new Date(),
      assetId: savedAsset.id,
      user_id: req.user.id
    });
    const savedAccount = await this.bankAccountRepo.save(account);

    // Update net worth snapshots
    await this.netWorthService.updateTodaySnapshot(savedAsset, req.user.id);

    return savedAccount;
  }

  @Put(':id')
  async update(@Req() req, @Param('id') id: number, @Body() body: { name?: string; initialBalance?: number; currentBalance?: number; currency?: string; initialDate?: string }) {
    const account = await this.bankAccountRepo.findOne({ where: { id } });
    if (!account) throw new NotFoundException('Account not found');

    if (account.user_id !== req.user.id) {
      throw new ForbiddenException('You do not have permission to update this account');
    }

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
    await this.netWorthService.updateTodaySnapshot(updatedAsset, req.user.id);

    return account;
  }

  @Delete(':id')
  async remove(@Req() req, @Param('id') id: number) {
    const account = await this.bankAccountRepo.findOne({ where: { id } });
    if (account) {
      if (account.user_id !== req.user.id) {
        throw new ForbiddenException('You do not have permission to delete this account');
      }

      if (account.assetId) {
        await this.assetRepo.delete(account.assetId);
      }
      await this.bankAccountRepo.remove(account);

      // Update net worth snapshots after deletion
      await this.netWorthService.updateTodaySnapshot(undefined, req.user.id);
    }
    return { deleted: true };
  }
}
