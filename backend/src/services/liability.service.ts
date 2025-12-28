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

    findAll(): Promise<Liability[]> {
        return this.liabilityRepo.find();
    }

    findOne(id: number): Promise<Liability> {
        return this.liabilityRepo.findOne({ where: { id } });
    }

    create(liability: Partial<Liability>): Promise<Liability> {
        const newLiability = this.liabilityRepo.create(liability);
        return this.liabilityRepo.save(newLiability);
    }

    async update(id: number, liability: Partial<Liability>): Promise<Liability> {
        await this.liabilityRepo.update(id, liability);
        return this.liabilityRepo.findOne({ where: { id } });
    }

    async remove(id: number): Promise<void> {
        await this.liabilityRepo.delete(id);
    }
}
