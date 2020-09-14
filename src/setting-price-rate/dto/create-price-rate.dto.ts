import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreatePriceRateDto {
    @ApiProperty()
    @IsNumber()
    ratefrom: number;

    @ApiProperty()
    @IsNumber()
    rateTo: number;

    @ApiProperty()
    @IsNumber()
    rate: number;
}
