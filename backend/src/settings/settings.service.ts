import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from '../entities/setting.entity';

@Injectable()
export class SettingsService {
    constructor(
        @InjectRepository(Setting)
        private settingsRepo: Repository<Setting>,
    ) { }

    async findAll(userId: number): Promise<Record<string, string>> {
        const settings = await this.settingsRepo.find({ where: { user_id: userId } });
        // Convert array to object { key: value } for easier frontend consumption
        return settings.reduce((acc, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {} as Record<string, string>);
    }

    async update(userId: number, key: string, value: string): Promise<Setting> {
        let setting = await this.settingsRepo.findOne({ where: { user_id: userId, key } });

        if (setting) {
            setting.value = value;
        } else {
            setting = this.settingsRepo.create({
                user_id: userId,
                key,
                value,
            });
        }

        return this.settingsRepo.save(setting);
    }
}
