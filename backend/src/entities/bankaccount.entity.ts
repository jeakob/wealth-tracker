import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class BankAccount {
  @PrimaryGeneratedColumn()
  id: number;

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
