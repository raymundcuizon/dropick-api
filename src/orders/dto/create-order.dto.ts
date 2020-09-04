import { PaymentStatus } from '../order-payment-status.enum';
import { MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
    @ApiProperty()
    id?: number;

    @ApiProperty()
    orderId?: string;

    @ApiProperty()
    buyerName: string;

    @ApiProperty()
    @MaxLength(4)

    @ApiProperty()
    amountOfItem: number;

    @ApiProperty()
    paymentStatus?: PaymentStatus;

    @ApiProperty()
    description: string;
}
