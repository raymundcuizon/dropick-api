import { ApiProperty } from '@nestjs/swagger';

export class SigninResponseDTO {
  @ApiProperty() accessToken: string;
  @ApiProperty() refreshToken: string;
}
