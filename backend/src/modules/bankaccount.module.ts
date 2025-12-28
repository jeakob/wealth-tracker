import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankAccount } from '../entities/bankaccount.entity';
import { BankAccountController } from '../controllers/bankaccount.controller';

import { Asset } from '../entities/asset.entity';
import { NetWorthModule } from './networth.module';

@Module({
  imports: [TypeOrmModule.forFeature([BankAccount, Asset]), NetWorthModule],
  controllers: [BankAccountController],
})
export class BankAccountModule { }
