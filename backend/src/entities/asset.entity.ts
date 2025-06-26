import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('assets')
export class Asset {
  @PrimaryGeneratedColumn()
  id: number;

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
