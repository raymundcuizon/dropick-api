import { ApiProperty } from '@nestjs/swagger';

export class ReceiveOrderDto {
    @ApiProperty()
    orderId: string;

    @ApiProperty()
    note: string;
}
