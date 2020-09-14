import { IsNotEmpty, IsNumber } from 'class-validator';

export class SellersOnlyResponseDTO {
    id: number;
    name: string;
    address: string;
    username: string;
}
