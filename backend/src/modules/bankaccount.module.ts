import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankAccount } from '../entities/bankaccount.entity';
import { BankAccountController } from '../controllers/bankaccount.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BankAccount])],
  controllers: [BankAccountController],
})
export class BankAccountModule {}
