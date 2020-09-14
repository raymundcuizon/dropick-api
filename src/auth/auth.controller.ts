import { Controller, Post, Body, ValidationPipe, Get, Query, Logger, UnauthorizedException, UseGuards, Patch, Param, Delete } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { ROUTES } from '../constants/constants.json';
import { SignoutDto } from './dto/signoutDto';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';
import { GetUsersFilterDTO } from './dto/getUsersFilter.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { UserRoles } from './userrole-enum';
import { AuthGuard } from '@nestjs/passport';
import { GetUsersResponseDTO } from './dto/getUsersResponse.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiUnauthorizedResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { SigninUserDTO } from './dto/signinUser.dto';
import { SignupResponseDto } from './dto/signup-response.dto';

@Controller(ROUTES.AUTH.BASE)
export class AuthController {
  private logger = new Logger('AuthController');
  constructor(
    private authService: AuthService,
  ) {}

  @Post(ROUTES.AUTH.SIGNUP)
  @ApiCreatedResponse({
    description: 'user registration',
  })
  @ApiBody({type: AuthCredentialsDto})
  signUp(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<SignupResponseDto> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post(ROUTES.AUTH.SIGNIN)
  @ApiOkResponse({
    description: 'User login',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credential',
  })
  @ApiBody({type: SigninUserDTO})
  signIn(@Body() signinUserDTO: SigninUserDTO): Promise<{
    accessToken: string,
    refreshToken: string,
   }> {
    return this.authService.signIn(signinUserDTO);
  }

  @Post(ROUTES.AUTH.ACTIVATE_ACCOUNT)
  @ApiOkResponse({
    description: 'Successfully activated',
  })
  activateUser(
    @Param('activationKey') activationKey: string,
    @Param('username') username: string,
  ): Promise<void> {
    return this.authService.activateUser(activationKey, username);
  }

  // Protected Routes
  @Post(ROUTES.AUTH.SIGNOUT)
  @ApiOkResponse({
    description: 'User logged out',
  })
  @ApiBody({type: SignoutDto})
  @ApiBearerAuth()
  signOut(@Body() signoutDto: SignoutDto) {
    return this.authService.signOut(signoutDto.refreshToken);
  }

  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @Patch(ROUTES.AUTH.USER_UPDATE)
  @ApiBody({type: SignoutDto})
  updateUser(
    @Param('id') id: number,
    @Body() authCredentialsDto: AuthCredentialsDto,
    user: User,
  ): Promise<void> {
    return null;
  }

  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiBody({type: SignoutDto})
  @Delete(ROUTES.AUTH.USER_DELETE)
  deleteUser(
    @Param('id') id: number,
    user: User,
  ): Promise<void> {
    return null;
  }

  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiBody({type: SignoutDto})
  @Delete(ROUTES.AUTH.GET_USER)
  getUser(
    @Param('id') id: number,
    user: User,
  ): Promise<void> {
    return null;
  }

  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiBody({type: SignoutDto})
  @Get(ROUTES.AUTH.USERS)
  getUsers(
      @Query(ValidationPipe) getUserssFilterDTO: GetUsersFilterDTO,
      @GetUser() user: User): Promise<Pagination<GetUsersResponseDTO>> {
      this.logger.verbose(`getUsers initiate`);
      if (user.role === UserRoles.ADMIN || user.role === UserRoles.STAFF) {
        return this.authService.getUsers(getUserssFilterDTO);
      }

      throw new UnauthorizedException();
  }

}
