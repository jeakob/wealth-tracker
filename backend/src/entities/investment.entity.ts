import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('investments')
export class Investment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  user_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  asset_type: string;

  @Column()
  asset_name: string;

  @Column('decimal', { precision: 18, scale: 2 })
  amount: number;

  @Column('decimal', { precision: 18, scale: 2 })
  value: number;

  @Column({ nullable: true })
  acquired_at: Date;

  @CreateDateColumn()
  created_at: Date;
}
