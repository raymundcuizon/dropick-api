import { BaseEntity, Entity, PrimaryGeneratedColumn, ManyToOne, Column, Double, CreateDateColumn, UpdateDateColumn, Timestamp } from 'typeorm';
import { User } from '../auth/user.entity';
import { PaymentStatus } from './order-payment-status.enum';
import { OrderStatus } from './order-status.enum';

@Entity()
export class Order extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    orderId: string;

    @Column()
    buyerName: string;

    @Column('decimal', { precision: 10, scale: 2 })
    amountOfItem: number;

    @Column('decimal', { precision: 10, scale: 2 })
    amountForBuyer: number;

    @Column({
        type: 'enum',
        enum: PaymentStatus,
        default: PaymentStatus.UNPAID,
      })
    paymentStatus: PaymentStatus;

    @Column({
        type: 'enum',
        enum: OrderStatus,
        default: OrderStatus.UNCLAIMED,
      })
    status: OrderStatus;

    @Column()
    description: string;

    @ManyToOne(type => User, user => user.orders, { eager: false })
    user: User;

    @Column()
    userId: number;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    claimedAt: Timestamp;
}
