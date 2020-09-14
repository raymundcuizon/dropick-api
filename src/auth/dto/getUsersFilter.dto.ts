import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetUsersFilterDTO {
    // @IsNotEmpty()
    page: number = 1;

    @IsNotEmpty()
    limit: number;

    keyword?: string;
    type?: string;
}
