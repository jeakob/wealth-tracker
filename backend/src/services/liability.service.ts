import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Liability } from '../entities/liability.entity';

@Injectable()
export class LiabilityService {
    constructor(
        @InjectRepository(Liability)
        private liabilityRepo: Repository<Liability>,
    ) { }

    findAll(userId: number): Promise<Liability[]> {
        return this.liabilityRepo.find({ where: { user_id: userId } });
    }

    findOne(id: number, userId: number): Promise<Liability> {
        return this.liabilityRepo.findOne({ where: { id, user_id: userId } });
    }

    create(liability: Partial<Liability>, userId: number): Promise<Liability> {
        const newLiability = this.liabilityRepo.create({
            ...liability,
            user_id: userId
        });
        return this.liabilityRepo.save(newLiability);
    }

    async update(id: number, liability: Partial<Liability>, userId: number): Promise<Liability> {
        const existing = await this.findOne(id, userId);
        if (!existing) return null;

        await this.liabilityRepo.update(id, liability);
        return this.liabilityRepo.findOne({ where: { id } });
    }

    async remove(id: number, userId: number): Promise<void> {
        const existing = await this.findOne(id, userId);
        if (existing) {
            await this.liabilityRepo.delete(id);
        }
    }
}
