import { Injectable } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(OrderRepository)
        private orderRepository: OrderRepository,
      ) {}

    async createOrder(
        createOrderDto: CreateOrderDto,
        user: User,
        ): Promise<void> {
        return this.orderRepository.createOrder(createOrderDto, user);
    }
}
