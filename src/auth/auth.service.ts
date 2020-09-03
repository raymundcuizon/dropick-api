import { Injectable, UnauthorizedException, Logger, GoneException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { uid, suid } from 'rand-token';
import { GetUserssFilterDTO } from './dto/getUsersFilter.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { User } from './user.entity';
import { GetUsersResponseDTO } from './dto/getUsersResponse.dto';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');
  private refreshTokens = {};
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepository.signUp(authCredentialsDto);
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string, refreshToken: string }> {
    const username = await this.userRepository.validateUserPassword(authCredentialsDto);

    if (!username) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = { username };
    const accessToken = await this.jwtService.sign(payload);
    const refreshToken: string = uid(256);
    this.refreshTokens[refreshToken] = username;
    this.logger.debug(`Generated JWT Token with payload ${JSON.stringify(payload)}`);
    return { accessToken, refreshToken };
  }

  async getUsers(
    getOrdersFilterDTO: GetUserssFilterDTO,
  ): Promise<Pagination<GetUsersResponseDTO>> {
    return this.userRepository.getUsers(getOrdersFilterDTO);
  }

  signOut(refreshToken: string) {
    if (refreshToken in this.refreshTokens) {
      return true;
    }
    throw new GoneException();
  }
}
