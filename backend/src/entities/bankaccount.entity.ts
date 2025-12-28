import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class BankAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  user_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ unique: true })
  name: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  initialBalance: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  currentBalance: number;

  @Column({ default: 'USD' })
  currency: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  initialDate: Date;

  @Column({ nullable: true })
  assetId: number;
}
