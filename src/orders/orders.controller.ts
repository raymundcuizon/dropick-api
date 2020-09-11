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
import { User } from '../auth/user.entity';
import { GetUser } from '../auth/get-user.decorator';
import { Order } from './order.entity';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateOrderResponseDto } from './dto/create-order-response.dto';
import { UserRoles } from '../auth/userrole-enum';
import { Pagination } from 'nestjs-typeorm-paginate';
import { GetOrdersFilterDTO } from './dto/getOrdersFilter.dto';
import { ApiBearerAuth, ApiUnauthorizedResponse, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { ReceiveOrderDto } from './dto/receive-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';

@Controller(ROUTES.ORDER.BASE)
@UseGuards(AuthGuard())
@ApiUnauthorizedResponse()
@ApiBearerAuth()
export class OrdersController {
    private logger = new Logger('OrdersController');
    constructor(private orderService: OrdersService) {}

    @Post(ROUTES.ORDER.CREATE)
    @ApiBody({ type: CreateOrderDto })
    create(
        @Body() createOrderDto: CreateOrderDto,
        @GetUser() user: User): Promise<CreateOrderResponseDto> {
        this.logger.verbose(`create initiate`);
        return this.orderService.createOrder(createOrderDto, user);
    }

    @Get(ROUTES.ORDER.GET_ORDERS)
    @ApiOkResponse({ description: 'Get all orders' })
    getOrders(
        @Query(ValidationPipe) getOrdersFilterDTO: GetOrdersFilterDTO,
        @GetUser() user: User): Promise<Pagination<Order>> {
        this.logger.verbose(`getOrders initiate`);
        return this.orderService.getOrders(user, getOrdersFilterDTO);
    }

    @Get(ROUTES.ORDER.GET_ORDER)
    getOrder(
        @Param('id') id: number,
        @GetUser() user: User): Promise<OrderResponseDto> {
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

    @Post(ROUTES.ORDER.RECEIVING)
    receiving(
        @Body() receiveOrderDto: ReceiveOrderDto,
        @GetUser() user: User): Promise<void> {
        this.logger.verbose(`claim initiate`);
        if (user.role === UserRoles.ADMIN || user.role === UserRoles.STAFF) {
            return this.orderService.receiveOrder(receiveOrderDto, user);
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
