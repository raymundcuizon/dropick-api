import { ApiProperty } from '@nestjs/swagger';

export class SignoutDto {
    @ApiProperty({type: String, description: 'refreshToken'})
    refreshToken: string;
}
