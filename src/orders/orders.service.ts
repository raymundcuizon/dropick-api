import { Injectable, NotFoundException, Logger, InternalServerErrorException } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateOrderResponseDto } from './dto/create-order-response.dto';
import { Order } from './order.entity';
import { OrderLog } from './order-log.entity';
import { OrderStatus } from './order-status.enum';
import { PaymentStatus } from './order-payment-status.enum';
import * as moment from 'moment';
import {Pagination} from 'nestjs-typeorm-paginate';
import { GetOrdersFilterDTO } from './dto/getOrdersFilter.dto';
import { ReceiveOrderDto } from './dto/receive-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { SettingPriceRateService } from '../setting-price-rate/setting-price-rate.service';

@Injectable()
export class OrdersService {
    private logger = new Logger('OrdersService');
    constructor(
        @InjectRepository(OrderRepository)
        private orderRepository: OrderRepository,
        private readonly settingPriceRateService: SettingPriceRateService,
      ) {}

    async createOrder(
        createOrderDto: CreateOrderDto,
        user: User,
        ): Promise<CreateOrderResponseDto> {

        const amountForBuyer = await this.settingPriceRateService.getAmountRateForItem(createOrderDto.amountOfItem);
        createOrderDto.amountForBuyer = amountForBuyer;

        return this.orderRepository.createOrder(createOrderDto, user);
    }

    async receiveOrder(
        receiveOrderDto: ReceiveOrderDto,
        user: User,
        ): Promise<void> {
            const {
                orderId,
                note,
            } = receiveOrderDto;

            const order = await this.orderRepository.findOne({ where: { orderId } });
            order.note = note;

            await order.save();

            const orderLog = new OrderLog();
            orderLog.orderId = order.orderId;
            orderLog.amountOfItem = order.amountOfItem;
            orderLog.buyerName = order.buyerName;
            orderLog.description = order.description;
            orderLog.amountForBuyer = order.amountForBuyer;
            orderLog.orderId = order.orderId;
            orderLog.status = OrderStatus.RECEIVED;
            orderLog.paymentStatus = order.paymentStatus;
            orderLog.user = user;
            orderLog.claimedAt = order.claimedAt;
            orderLog.note = order.note;

            await orderLog.save();
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
    ): Promise<OrderResponseDto> {
        return await this.orderRepository.getOrderById(user, id);
    }

    async updateOrder(
        user: User,
        id: number,
        createOrderDto: CreateOrderDto,
    ): Promise<Order> {

        try {
            const { amountOfItem, description, paymentStatus, buyerName } = createOrderDto;
            const { order } = await this.orderRepository.getOrderById(user, id);

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

        const orderLog = new OrderLog();
        orderLog.orderId = order.orderId;
        orderLog.amountOfItem = order.amountOfItem;
        orderLog.buyerName = order.buyerName;
        orderLog.description = order.description;
        orderLog.amountForBuyer = order.amountForBuyer;
        orderLog.orderId = order.orderId;
        orderLog.status = OrderStatus.CLAIMED;
        orderLog.paymentStatus = order.paymentStatus;
        orderLog.userId = order.userId;
        orderLog.claimedAt = order.claimedAt;
        orderLog.note = order.note;

        await orderLog.save();
    }
}
