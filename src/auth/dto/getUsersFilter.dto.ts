import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetUserssFilterDTO {
    // @IsNotEmpty()
    page: number = 1;

    @IsNotEmpty()
    limit: number;
}
