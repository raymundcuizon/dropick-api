import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class SigninUserDTO {
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
}
