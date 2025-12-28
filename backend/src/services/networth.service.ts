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

    async syncSnapshots(newAsset?: Asset) {
        let assets = await this.assetRepo.find();

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

        const liabilities = await this.liabilityRepo.find();
        const bankAccounts = await this.bankAccountRepo.find();

        if (assets.length === 0 && liabilities.length === 0 && bankAccounts.length === 0) {
            await this.snapshotRepo.clear();
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
            // For dates before a bank account's initial date, it won't be included
            const totalBankAccounts = bankAccounts
                .filter(b => {
                    const bankDate = new Date(b.initialDate);
                    bankDate.setHours(0, 0, 0, 0);
                    return bankDate <= date;
                })
                .reduce((sum, b) => sum + Number(b.initialBalance), 0);

            // Subtract included liabilities
            // NOTE: Liability 'createdAt' could be used for historical accuracy, 
            // but for simplicity we'll subtract current liabilities from all active snapshots 
            // or we assumes liabilities exist 'now'. 
            // Better approach: filter by creation date if available, or just subtract current set from 'Today' 
            // and assume they apply historically (or apply from creation date). 
            // Let's use created_at <= date logic for correctness.

            const totalLiabilities = liabilities
                .filter(l => l.includeInNetWorth)
                .filter(l => {
                    const lDate = new Date(l.createdAt);
                    lDate.setHours(0, 0, 0, 0);
                    return lDate <= date;
                })
                .reduce((sum, l) => sum + Number(l.balance), 0);

            const total = totalAssets + totalBankAccounts - totalLiabilities;


            let snapshot = await this.snapshotRepo.findOne({ where: { snapshot_date: date } });
            if (snapshot) {
                snapshot.total = total;
            } else {
                snapshot = this.snapshotRepo.create({ snapshot_date: date, total });
            }
            snapshots.push(await this.snapshotRepo.save(snapshot));
        }

        return snapshots;
    }

    async updateTodaySnapshot(newAsset?: Asset) {
        return this.syncSnapshots(newAsset);
    }

    async getAllSnapshots() {
        return this.snapshotRepo.find({
            order: {
                snapshot_date: 'ASC',
            },
        });
    }

    async clearAllSnapshots() {
        return this.snapshotRepo.clear();
    }
}
