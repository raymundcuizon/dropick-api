import { Injectable, UnauthorizedException, Logger, GoneException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { GetUsersFilterDTO } from './dto/getUsersFilter.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { GetUsersResponseDTO } from './dto/getUsersResponse.dto';
import { SigninUserDTO } from './dto/signinUser.dto';
import { SignupResponseDto } from './dto/signup-response.dto';
import { SigninResponseDTO } from './dto/signinResponse.dto';
import * as config from 'config';
import { User } from './user.entity';
const jwtConfig = config.get('jwt');

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');
  private refreshTokens = {};
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<SignupResponseDto> {
    const newUser = await this.userRepository.signUp(authCredentialsDto);
    if (newUser) {
      // const message = await this.sendMeSms.sendSms(
      //   `this is sample message: ${response.activationCode}`,
      //   '+12029331300',
      //   authCredentialsDto.mobileNumber);

      const response = new SignupResponseDto();

      response.id = newUser.id;
      response.email = newUser.email;
      response.username = newUser.username;
      response.mobileNumber = newUser.mobileNumber;

      return response;
    }
  }

  async signIn(signinUserDTO: SigninUserDTO): Promise<SigninResponseDTO> {
    const user = await this.userRepository.validateUserPassword(signinUserDTO);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.genToken(user);
  }

  async authRefresh(refToken: string): Promise<SigninResponseDTO> {

    const decodeToken: any = this.jwtService.decode(refToken);

    if (!decodeToken.username) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = await this.userRepository.findOne({ username : decodeToken.username });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.genToken(user);
  }

  async activateUser(activationKey: string, username: string): Promise<void> {
    return this.userRepository.activationCode(activationKey, username);
  }

  private genToken(user: User) {

    const payload: JwtPayload = {
      id: user.id,
      username: user.username,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      isActivated: user.isActivated,
      address: user.address,
      city: user.city,
      province: user.province,
      mobileNumber: user.mobileNumber,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: jwtConfig.expiresIn });
    const refreshToken = this.jwtService.sign({ username: payload.username }, { expiresIn: jwtConfig.expiresInRefesh });
    this.logger.debug(`Generated JWT Token with payload ${JSON.stringify(payload)}`);
    return { accessToken, refreshToken };
  }

  async getUsers(
    getOrdersFilterDTO: GetUsersFilterDTO,
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
