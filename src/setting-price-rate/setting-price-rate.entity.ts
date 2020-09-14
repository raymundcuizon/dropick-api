import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class SettingPriceRate extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('decimal', { precision: 10, scale: 2 })
    rateFrom: number;

    @Column('decimal', { precision: 10, scale: 2 })
    rateTo: number;

    @Column('decimal', { precision: 10, scale: 2 })
    rate: number;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}
