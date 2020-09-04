import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, Matches, IsBoolean } from 'class-validator';

export class AuthCredentialsDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @ApiProperty({type: String, description: 'username'})
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(
    /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
    { message: 'password too weak' },
  )
  @ApiProperty({type: String, description: 'password'})
  password: string;

  @IsString()
  @ApiProperty({type: String, description: 'email'})
  email: string;

  @IsString()
  @ApiProperty({type: String, description: 'firstname'})
  firstname: string;

  @IsString()
  @ApiProperty({type: String, description: 'lastname'})
  lastname: string;

  // @IsBoolean()
  isActivated?: boolean;

  @IsString()
  @ApiProperty({type: String, description: 'address'})
  address: string;

  @IsString()
  @ApiProperty({type: String, description: 'city'})
  city: string;

  @IsString()
  @ApiProperty({type: String, description: 'province'})
  province: string;

  @IsString()
  @ApiProperty({type: String, description: 'string'})
  mobileNumber: string;

}
