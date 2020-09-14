import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class SettingPriceRate extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    ratefrom: string;

    @Column()
    rateTo: string;

    @Column()
    rate: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}
