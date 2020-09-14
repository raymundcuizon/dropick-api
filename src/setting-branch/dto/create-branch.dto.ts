import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateBranchDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    address: string;

    @ApiProperty()
    @IsString()
    contactNumber: string;
}
