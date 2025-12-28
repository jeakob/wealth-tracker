import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NetWorthSnapshot } from '../entities/networth.entity';
import { Asset } from '../entities/asset.entity';
import { Liability } from '../entities/liability.entity';
import { BankAccount } from '../entities/bankaccount.entity';

@Injectable()
export class NetWorthService {
    constructor(
        @InjectRepository(NetWorthSnapshot)
        private snapshotRepo: Repository<NetWorthSnapshot>,
        @InjectRepository(Asset)
        private assetRepo: Repository<Asset>,
        @InjectRepository(Liability)
        private liabilityRepo: Repository<Liability>,
        @InjectRepository(BankAccount)
        private bankAccountRepo: Repository<BankAccount>,
    ) { }

    async syncSnapshots(userId: number, newAsset?: Asset) {
        let assets = await this.assetRepo.find({ where: { user_id: userId } });

        // Ensure newAsset is included (handle eventual consistency/race conditions)
        if (newAsset) {
            const exists = assets.find(a => a.id === newAsset.id);
            if (!exists) {
                assets.push(newAsset);
            } else {
                assets = assets.map(a => a.id === newAsset.id ? newAsset : a);
            }
        }

        // Exclude "Bank Account" type assets since we handle bank accounts separately
        assets = assets.filter(a => a.type !== 'Bank Account');

        const liabilities = await this.liabilityRepo.find({ where: { user_id: userId } });
        const bankAccounts = await this.bankAccountRepo.find({ where: { user_id: userId } });

        if (assets.length === 0 && liabilities.length === 0 && bankAccounts.length === 0) {
            await this.snapshotRepo.delete({ user_id: userId });
            return [];
        }

        // Get all unique dates from assets and bank accounts, set to start of day
        const dates = Array.from(new Set([
            ...assets.map(a => {
                const d = new Date(a.date);
                d.setHours(0, 0, 0, 0);
                return d.getTime();
            }),
            ...bankAccounts.map(b => {
                const d = new Date(b.initialDate);
                d.setHours(0, 0, 0, 0);
                return d.getTime();
            })
        ])).sort((a, b) => a - b);

        // Add Liability creation dates if we want full history, but for now defaulting to asset-driven dates + today.

        // Also include TODAY if not already there
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (!dates.includes(today.getTime())) {
            dates.push(today.getTime());
        }
        dates.sort((a, b) => a - b);

        const snapshots = [];
        for (const time of dates) {
            const date = new Date(time);

            // Total as of this date: sum of assets where asset.date <= this date
            const totalAssets = assets
                .filter(a => {
                    const assetDate = new Date(a.date);
                    assetDate.setHours(0, 0, 0, 0);
                    return assetDate <= date;
                })
                .reduce((sum, a) => sum + Number(a.value), 0);

            // Add bank account initial balances where initialDate <= this date
            // For the current date (today) and beyond, use currentBalance
            // For dates before today, use initialBalance
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const totalBankAccounts = bankAccounts
                .filter(b => {
                    const bankDate = new Date(b.initialDate);
                    bankDate.setHours(0, 0, 0, 0);
                    return bankDate <= date;
                })
                .reduce((sum, b) => {
                    // Use currentBalance for today and future dates, initialBalance for historical dates
                    const isToday = date.getTime() === today.getTime();
                    const isFuture = date > today;
                    const balanceToUse = (isToday || isFuture) ? Number(b.currentBalance) : Number(b.initialBalance);
                    return sum + balanceToUse;
                }, 0);

            // Subtract included liabilities
            const totalLiabilities = liabilities
                .filter(l => l.includeInNetWorth)
                .filter(l => {
                    const lDate = new Date(l.createdAt);
                    lDate.setHours(0, 0, 0, 0);
                    return lDate <= date;
                })
                .reduce((sum, l) => sum + Number(l.balance), 0);

            const total = totalAssets + totalBankAccounts - totalLiabilities;


            let snapshot = await this.snapshotRepo.findOne({
                where: {
                    snapshot_date: date,
                    user_id: userId
                }
            });

            if (snapshot) {
                snapshot.total = total;
            } else {
                snapshot = this.snapshotRepo.create({
                    snapshot_date: date,
                    total,
                    user_id: userId
                });
            }
            snapshots.push(await this.snapshotRepo.save(snapshot));
        }

        return snapshots;
    }

    async updateTodaySnapshot(newAsset: Asset | undefined, userId: number) {
        return this.syncSnapshots(userId, newAsset);
    }

    async getAllSnapshots(userId: number) {
        return this.snapshotRepo.find({
            where: { user_id: userId },
            order: {
                snapshot_date: 'ASC',
            },
        });
    }

    async clearAllSnapshots(userId: number) {
        return this.snapshotRepo.delete({ user_id: userId });
    }
}
