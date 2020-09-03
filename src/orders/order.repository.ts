import { EntityRepository, Repository } from 'typeorm';
import { Order } from './order.entity';
import { Logger, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateOrderResponseDto } from './dto/create-order-response.dto';
import { User } from '../auth/user.entity';
import { OrderStatus } from './order-status.enum';
import { uid, suid } from 'rand-token';
import { amountItem_const } from '../constants/amount-item.json';
import { UserRoles } from 'src/auth/userrole-enum';
import { promises } from 'dns';

@EntityRepository(Order)
export class OrderRepository extends Repository<Order> {
    private logger = new Logger('OrderRepository');

    async createOrder(
        createOrderDto: CreateOrderDto,
        user: User,
    ): Promise<CreateOrderResponseDto> {

        try {
            const {
                amountOfItem,
                buyerName,
                description,
                paymentStatus,
            } = createOrderDto;

            const order = new Order();

            order.amountOfItem = amountOfItem;
            order.buyerName = buyerName;
            order.description = description;
            order.amountForBuyer = this.amountMatching(amountOfItem);
            order.orderId = uid(7);
            order.status = OrderStatus.UNCLAIMED;
            order.paymentStatus = paymentStatus;
            order.user = user;

            const res = await order.save();
            const createOrderResponseDto = new CreateOrderResponseDto();
            createOrderResponseDto.id = res.id;
            createOrderResponseDto.amountForBuyer = res.amountForBuyer;
            createOrderResponseDto.amountOfItem = res.amountOfItem;
            createOrderResponseDto.buyerName = res.buyerName;
            createOrderResponseDto.orderId = res.orderId;
            createOrderResponseDto.description = res.description;

            return createOrderResponseDto;

        } catch (error) {
            this.logger.error(`createOrder: failed to create`);
            throw new InternalServerErrorException();
        }
    }

    async getOrders(
        user: User,
    ): Promise<Order[]> {
        const query = this.createQueryBuilder('order');
        if (user.role === UserRoles.SELLER) {
            query.where('order.userId = :userId', { userId: user.id });
        }

        try {
            const orders = await query.getMany();
            return orders;
        } catch (error) {
            this.logger.error(`Failed to get tasks for user "${user.username}"`, error.stack);
            throw new InternalServerErrorException();
        }
    }

    async getOrderById(user: User, id: number): Promise<Order> {
        const query = this.createQueryBuilder('order');
        query.where('order.id = :id', {id});

        if (user.role === UserRoles.SELLER) {
            query.andWhere('order.userId = :userId', { userId: user.id });
        }
        const found = await query.getOne();
        if (!found) {
            throw new NotFoundException(`Order with ID "${id}" not found`);
        }
        return found;
    }

    public amountMatching(itemAmount: number): number {
        let result: number;
        amountItem_const.forEach((_x) => {
            if ((itemAmount >= _x.from) && itemAmount <= _x.to) {
                result = _x.total;
            }
        });
        return result;
    }
}
