import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, UpdateDateColumn, Unique } from 'typeorm';
import { User } from './user.entity';

@Entity('settings')
@Unique(['user_id', 'key']) // Ensure one key per user
export class Setting {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column()
    key: string;

    @Column()
    value: string;

    @UpdateDateColumn()
    updated_at: Date;
}
