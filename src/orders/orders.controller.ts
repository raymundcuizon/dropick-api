import { Controller, UseGuards, Logger, Get, Post, Patch, Body } from '@nestjs/common';
import { ROUTES } from '../constants/constants.json';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { Order } from './order.entity';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller(ROUTES.ORDER.BASE)
@UseGuards(AuthGuard())
export class OrdersController {
    private logger = new Logger('TasksController');
    constructor(private orderService: OrdersService) {}

    @Post(ROUTES.ORDER.CREATE)
    create(
        @Body() createOrderDto: CreateOrderDto,
        @GetUser() user: User): Promise<void> {
        this.logger.verbose(`create initiate`);
        return this.orderService.createOrder(createOrderDto, user);
    }

    @Get(ROUTES.ORDER.GET_ORDERS)
    getOrders(@GetUser() user: User): Promise<Order[]> {
        this.logger.verbose(`getOrders initiate`);
        return null;
    }

    @Get(ROUTES.ORDER.GET_ORDER)
    getOrder(@GetUser() user: User): Promise<Order> {
        this.logger.verbose(`getOrder initiate`);
        return null;
    }

    @Patch(ROUTES.ORDER.UPDATE_STATUS)
    updateStatus(@GetUser() user: User): Promise<void> {
        this.logger.verbose(`updateStatus initiate`);
        return null;
    }

    @Patch(ROUTES.ORDER.CLAIM)
    claim(@GetUser() user: User): Promise<void> {
        this.logger.verbose(`claim initiate`);
        return null;
    }

    @Patch(ROUTES.ORDER.UPDATE)
    update(@GetUser() user: User): Promise<Order> {
        this.logger.verbose(`update initiate`);
        return null;
    }
}
