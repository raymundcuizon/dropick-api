import { PaymentStatus } from '../order-payment-status.enum';

export class CreateOrderDto {
    orderId: string;
    buyerName: string;
    amount: number;
    paymentStatus?: PaymentStatus;
    status?: string;
    description: string;
    claimedAt?: string;
}
