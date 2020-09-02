import { PaymentStatus } from '../order-payment-status.enum';
import { OrderStatus } from '../order-status.enum';

export class CreateOrderResponseDto {
    id: number;
    orderId: string;
    buyerName: string;
    amountOfItem: number;
    amountForBuyer: number;
    paymentStatus: PaymentStatus;
    status: OrderStatus;
    description: string;
}
