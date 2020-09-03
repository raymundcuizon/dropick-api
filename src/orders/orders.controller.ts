import { Controller,
    UseGuards,
    Logger,
    Get,
    Post,
    Patch,
    Body,
    Param,
    ParseIntPipe,
    UnauthorizedException,
    Query,
    ValidationPipe } from '@nestjs/common';
import { ROUTES } from '../constants/constants.json';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { Order } from './order.entity';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateOrderResponseDto } from './dto/create-order-response.dto';
import { UserRoles } from 'src/auth/userrole-enum';
import { Pagination } from 'nestjs-typeorm-paginate';
import { GetOrdersFilterDTO } from './dto/getOrdersFilter.dto';

@Controller(ROUTES.ORDER.BASE)
@UseGuards(AuthGuard())
export class OrdersController {
    private logger = new Logger('OrdersController');
    constructor(private orderService: OrdersService) {}

    @Post(ROUTES.ORDER.CREATE)
    create(
        @Body() createOrderDto: CreateOrderDto,
        @GetUser() user: User): Promise<CreateOrderResponseDto> {
        this.logger.verbose(`create initiate`);
        return this.orderService.createOrder(createOrderDto, user);
    }

    @Get(ROUTES.ORDER.GET_ORDERS)
    getOrders(
        @Query(ValidationPipe) getOrdersFilterDTO: GetOrdersFilterDTO,
        @GetUser() user: User): Promise<Pagination<Order>> {
        this.logger.verbose(`getOrders initiate`);
        return this.orderService.getOrders(user, getOrdersFilterDTO);
    }

    @Get(ROUTES.ORDER.GET_ORDER)
    getOrder(
        @Param('id') id: number,
        @GetUser() user: User): Promise<Order> {
        this.logger.verbose(`getOrder initiate`);
        return this.orderService.getOrderByid(user, id);
    }

    @Patch(ROUTES.ORDER.UPDATE_STATUS)
    updateStatus(@GetUser() user: User): Promise<void> {
        this.logger.verbose(`updateStatus initiate`);
        return null;
    }

    @Patch(ROUTES.ORDER.CLAIM)
    claim(
        @Param('orderId') orderId: string,
        @GetUser() user: User): Promise<void> {
        this.logger.verbose(`claim initiate`);
        if (user.role === UserRoles.ADMIN || user.role === UserRoles.STAFF) {
            return this.orderService.claim(orderId);
        }

        throw new UnauthorizedException();
    }

    @Patch(ROUTES.ORDER.UPDATE)
    update(
        @Param('id') id: number,
        @Body() createOrderDto: CreateOrderDto,
        @GetUser() user: User): Promise<Order> {
        this.logger.verbose(`update initiate`);
        return this.orderService.updateOrder(user, id, createOrderDto);
    }
}
