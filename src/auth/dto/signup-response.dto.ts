import { ApiProperty } from '@nestjs/swagger';

export class SignupResponseDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    username: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    mobileNumber: string;
}
