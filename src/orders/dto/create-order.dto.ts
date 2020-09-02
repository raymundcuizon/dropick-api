import { PaymentStatus } from '../order-payment-status.enum';
import { MaxLength } from 'class-validator';

export class CreateOrderDto {
    buyerName: string;

    @MaxLength(4)
    amountOfItem: number;

    paymentStatus?: PaymentStatus;

    description: string;
}