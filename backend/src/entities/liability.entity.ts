import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('liabilities')
export class Liability {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    category: string; // Credit Card, Loan, Mortgage, Other

    @Column('decimal', { precision: 18, scale: 2 })
    balance: number;

    @Column('decimal', { precision: 5, scale: 2, nullable: true })
    interestRate: number; // % APR

    @Column({ nullable: true })
    institution: string;

    @Column('decimal', { precision: 18, scale: 2, nullable: true })
    monthlyPayment: number;

    @Column('int', { nullable: true })
    remainingMonths: number;

    @Column({ default: false })
    includeInNetWorth: boolean;

    @Column('text', { nullable: true })
    notes: string;

    @CreateDateColumn()
    createdAt: Date;
}
