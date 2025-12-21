import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BankAccount } from '../entities/bankaccount.entity';

@Controller('bankaccounts')
export class BankAccountController {
  constructor(
    @InjectRepository(BankAccount)
    private readonly bankAccountRepo: Repository<BankAccount>,
  ) { }

  @Get()
  async findAll(): Promise<BankAccount[]> {
    return this.bankAccountRepo.find();
  }

  @Post()
  async create(@Body('name') name: string): Promise<BankAccount> {
    const account = this.bankAccountRepo.create({ name });
    return this.bankAccountRepo.save(account);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.bankAccountRepo.delete(id);
    return { deleted: true };
  }
}
