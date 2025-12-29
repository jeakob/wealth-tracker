import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('liabilities')
export class Liability {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    user_id: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

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
