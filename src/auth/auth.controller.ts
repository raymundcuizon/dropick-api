import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Get,
  Query,
  Logger,
  UnauthorizedException,
  UseGuards,
  Patch,
  Param,
  Delete,
  BadRequestException,
  HttpStatus,
  HttpCode } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { ROUTES } from '../constants/constants.json';
import { RefreshDto } from './dto/refreshDto';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';
import { GetUsersFilterDTO } from './dto/getUsersFilter.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { UserRoles } from './userrole-enum';
import { AuthGuard } from '@nestjs/passport';
import { GetUsersResponseDTO } from './dto/getUsersResponse.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBody,
  ApiBearerAuth,
  ApiResponse } from '@nestjs/swagger';
import { SigninUserDTO } from './dto/signinUser.dto';
import { SignupResponseDto } from './dto/signup-response.dto';
import { SigninResponseDTO } from './dto/signinResponse.dto';

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
  @HttpCode(200)
  @ApiResponse({ status: HttpStatus.OK, type: SigninResponseDTO })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: UnauthorizedException })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BadRequestException })
  @ApiBody({type: SigninUserDTO})
  signIn(@Body() signinUserDTO: SigninUserDTO): Promise<SigninResponseDTO> {
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
  @ApiBody({type: RefreshDto})
  @ApiBearerAuth()
  signOut(@Body() refreshDto: RefreshDto) {
    return this.authService.signOut(refreshDto.refreshToken);
  }

  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @Patch(ROUTES.AUTH.USER_UPDATE)
  @ApiBody({type: RefreshDto})
  updateUser(
    @Param('id') id: number,
    @Body() authCredentialsDto: AuthCredentialsDto,
    @GetUser() user: User,
  ): Promise<void> {
    return null;
  }

  @Post(ROUTES.AUTH.REFRESH)
  @HttpCode(200)
  @ApiResponse({ status: HttpStatus.OK, type: SigninResponseDTO })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: UnauthorizedException })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BadRequestException })
  authRefresh( @Body() refreshDto: RefreshDto): Promise<SigninResponseDTO> {
    return this.authService.authRefresh(refreshDto.refreshToken);
  }

  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiBody({type: RefreshDto})
  @Delete(ROUTES.AUTH.USER_DELETE)
  deleteUser(
    @Param('id') id: number,
    @GetUser() user: User,
  ): Promise<void> {
    return null;
  }

  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiBody({type: RefreshDto})
  @Delete(ROUTES.AUTH.GET_USER)
  getUser(
    @Param('id') id: number,
    @GetUser() user: User,
  ): Promise<void> {
    return null;
  }

  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiBody({type: ''})
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
