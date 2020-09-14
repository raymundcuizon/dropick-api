import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetOrdersFilterDTO {
    // @IsNotEmpty()
    page: number = 1;

    @IsNotEmpty()
    limit: number;

    keyword?: string;
    type?: string;
    dateRangeFrom?: string;
    dateRangeTo?: string;
}
