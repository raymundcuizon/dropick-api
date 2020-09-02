import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateOrderResponseDto } from './dto/create-order-response.dto';
import { Order } from './order.entity';
import { OrderStatus } from './order-status.enum';
import { PaymentStatus } from './order-payment-status.enum';
import * as moment from 'moment';

@Injectable()
export class OrdersService {
    private logger = new Logger('OrdersService');
    constructor(
        @InjectRepository(OrderRepository)
        private orderRepository: OrderRepository,
      ) {}

    async createOrder(
        createOrderDto: CreateOrderDto,
        user: User,
        ): Promise<CreateOrderResponseDto> {
        return this.orderRepository.createOrder(createOrderDto, user);
    }

    async getOrders(
        user: User,
    ): Promise<Order[]> {
        return this.orderRepository.getOrders(user);
    }

    async getOrderByid(
        user: User,
        id: number,
    ): Promise<Order> {
        return await this.orderRepository.getOrderById(user, id);
    }

    async claim(
        orderId: string,
    ): Promise<void> {
        const order = await this.orderRepository.findOne({ where: { orderId } });
        if (!order) {
            throw new NotFoundException(`Order with ORDERID "${orderId}" not found`);
        }
        order.status = OrderStatus.CLAIMED;
        order.paymentStatus = PaymentStatus.PAID;
        order.claimedAt = moment().toDate();
        await order.save();
    }
}
