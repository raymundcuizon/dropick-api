import { Controller, Post, Body, ValidationPipe, Get, Query, Logger, UnauthorizedException, UseGuards, Patch, Param, Delete } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { ROUTES } from '../constants/constants.json';
import { SignoutDto } from './dto/signoutDto';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';
import { GetUserssFilterDTO } from './dto/getUsersFilter.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { UserRoles } from './userrole-enum';
import { AuthGuard } from '@nestjs/passport';
import { GetUsersResponseDTO } from './dto/getUsersResponse.dto';

@Controller(ROUTES.AUTH.BASE)
export class AuthController {
  private logger = new Logger('AuthController');
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

  // Protected Routes

  @UseGuards(AuthGuard())
  @Patch(ROUTES.AUTH.USER_UPDATE)
  updateUser(
    @Param('id') id: number,
    @Body() authCredentialsDto: AuthCredentialsDto,
    user: User,
  ): Promise<void> {
    return null;
  }

  @UseGuards(AuthGuard())
  @Delete(ROUTES.AUTH.USER_DELETE)
  deleteUser(
    @Param('id') id: number,
    user: User,
  ): Promise<void> {
    return null;
  }

  @UseGuards(AuthGuard())
  @Delete(ROUTES.AUTH.GET_USER)
  getUser(
    @Param('id') id: number,
    user: User,
  ): Promise<void> {
    return null;
  }

  @UseGuards(AuthGuard())
  @Get(ROUTES.AUTH.USERS)
  getUsers(
      @Query(ValidationPipe) getUserssFilterDTO: GetUserssFilterDTO,
      @GetUser() user: User): Promise<Pagination<GetUsersResponseDTO>> {
      this.logger.verbose(`getUsers initiate`);
      if (user.role === UserRoles.ADMIN || user.role === UserRoles.STAFF) {
        return this.authService.getUsers(getUserssFilterDTO);
      }

      throw new UnauthorizedException();
  }

}
