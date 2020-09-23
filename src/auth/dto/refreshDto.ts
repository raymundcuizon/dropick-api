import { ApiProperty } from '@nestjs/swagger';

export class RefreshDto {
    @ApiProperty({type: String, description: 'refreshToken'})
    refreshToken: string;
}
