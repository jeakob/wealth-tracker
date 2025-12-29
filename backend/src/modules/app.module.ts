import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { InvestmentsModule } from '../investments/investments.module';
import { BankAccountModule } from './bankaccount.module';
import { AssetModule } from './asset.module';
import { NetWorthModule } from './networth.module';
import { LiabilityModule } from './liability.module';
import { UsersModule } from './users.module';
import { SeedModule } from './seed.module';
import { SettingsModule } from '../settings/settings.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'db',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'wealth_user',
      password: process.env.DB_PASSWORD || 'securepassword',
      database: process.env.DB_NAME || 'wealth_db',
      entities: [__dirname + '/../**/*.entity.{js,ts}'],
      synchronize: true, // Set to false in production
    }),
    AuthModule,
    UsersModule,
    SeedModule,
    InvestmentsModule,
    BankAccountModule,
    AssetModule,
    NetWorthModule,
    LiabilityModule,
  ],
})
export class AppModule { }
