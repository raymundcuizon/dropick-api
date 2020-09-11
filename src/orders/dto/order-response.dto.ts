import { PaymentStatus } from '../order-payment-status.enum';
import { OrderStatus } from '../order-status.enum';
import { Order } from '../order.entity';

export class OrderResponseDto {
    order: Order;
    orderLog: Order[];
}
