import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('net_worth_snapshots')
export class NetWorthSnapshot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('decimal', { precision: 18, scale: 2 })
  total: number;

  @Column()
  snapshot_date: Date;

  @CreateDateColumn()
  created_at: Date;
}
