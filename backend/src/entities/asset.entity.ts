import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('assets')
export class Asset {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  user_id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  type: string; // crypto, bank, other

  @Column()
  name: string;

  @Column('decimal', { precision: 18, scale: 2 })
  value: number;

  @Column()
  currency: string;

  @Column()
  date: string; // ISO date string

  @CreateDateColumn()
  created_at: Date;
}
