import { Injectable, NotFoundException, Logger, InternalServerErrorException } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateOrderResponseDto } from './dto/create-order-response.dto';
import { Order } from './order.entity';
import { OrderStatus } from './order-status.enum';
import { PaymentStatus } from './order-payment-status.enum';
import * as moment from 'moment';
import {Pagination} from 'nestjs-typeorm-paginate';
import { GetOrdersFilterDTO } from './dto/getOrdersFilter.dto';

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
        getOrdersFilterDTO: GetOrdersFilterDTO,
    ): Promise<Pagination<Order>> {
        return this.orderRepository.getOrders(user, getOrdersFilterDTO);
    }

    async getOrderByid(
        user: User,
        id: number,
    ): Promise<Order> {
        return await this.orderRepository.getOrderById(user, id);
    }

    async updateOrder(
        user: User,
        id: number,
        createOrderDto: CreateOrderDto,
    ): Promise<Order> {

        try {
            const { amountOfItem, description, paymentStatus, buyerName } = createOrderDto;
            const order = await this.orderRepository.getOrderById(user, id);

            const amountChangesCheck = (amountOfItem !== order.amountOfItem)
                ? this.orderRepository.amountMatching(amountOfItem)
                : order.amountForBuyer;

            order.amountOfItem = amountOfItem;
            order.amountForBuyer = amountChangesCheck;
            order.buyerName = buyerName;
            order.description = description;
            order.paymentStatus = paymentStatus;
            await order.save();

            return order;
        } catch (error) {
            this.logger.error(`updateOrder: failed to update`);
            throw new InternalServerErrorException();
        }
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
