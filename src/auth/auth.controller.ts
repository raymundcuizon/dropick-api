import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { ROUTES } from '../constants/constants.json';
import { SignoutDto } from './dto/signoutDto';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';

@Controller(ROUTES.AUTH.BASE)
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  @Post(ROUTES.AUTH.SIGNUP)
  signUp(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post(ROUTES.AUTH.SIGNIN)
  signIn(@Body() authCredentialsDto: AuthCredentialsDto): Promise<{
    accessToken: string,
    refreshToken: string,
   }> {
    return this.authService.signIn(authCredentialsDto);
  }

  @Post(ROUTES.AUTH.SIGNOUT)
  signOut(@Body() signoutDto: SignoutDto) {
    return this.authService.signOut(signoutDto.refreshToken);
  }
}
