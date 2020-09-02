import { EntityRepository, Repository } from 'typeorm';
import { Order } from './order.entity';
import { Logger, InternalServerErrorException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { User } from '../auth/user.entity';
import { OrderStatus } from './order-status.enum';

@EntityRepository(Order)
export class OrderRepository extends Repository<Order> {
    private logger = new Logger('OrderRepository');

    async createOrder(
        createOrderDto: CreateOrderDto,
        user: User,
    ): Promise<void> {

        try {
            const {
                amount,
                buyerName,
                description,
                orderId,
                paymentStatus,
            } = createOrderDto;

            const order = new Order();

            order.amount = amount;
            order.buyerName = buyerName;
            order.description = description;
            order.orderId = orderId;
            order.status = OrderStatus.UNCLAIMED;
            order.paymentStatus = paymentStatus;
            order.user = user;

            await order.save();

        } catch (error) {
            // console.log(error)
            this.logger.error(`createOrder: failed to create`);
            throw new InternalServerErrorException();
        }
    }
}
