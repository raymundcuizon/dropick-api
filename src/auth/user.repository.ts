import { Repository, EntityRepository } from 'typeorm';
import { ConflictException, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { uid, suid } from 'rand-token';
import { ROUTES } from '../constants/constants.json';
import { GetUsersFilterDTO } from './dto/getUsersFilter.dto';
import { Pagination, paginate } from 'nestjs-typeorm-paginate';
import { UserRoles } from './userrole-enum';
import { GetUsersResponseDTO } from './dto/getUsersResponse.dto';
import { SigninUserDTO } from './dto/signinUser.dto';
import { SellersOnlyResponseDTO } from './dto/sellers-only-response.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

  private logger = new Logger('UserRepository');

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    const {
      username,
      password,
      address,
      city,
      email,
      firstname,
      lastname,
      mobileNumber,
      province,
    } = authCredentialsDto;

    const user = new User();
    user.username = username;
    user.address = address;
    user.email = email,
    user.firstname = firstname,
    user.lastname = lastname,
    user.mobileNumber = mobileNumber,
    user.province = province;
    user.isActivated = false;
    user.city = city;
    user.activationCode = uid(6);
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

    try {
      return await user.save();
    } catch (error) {
      this.logger.log(error);
      if (error.code === '23505') { // duplicate username
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(signinUserDTO: SigninUserDTO): Promise<string> {
    const { username, password } = signinUserDTO;
    const user = await this.findOne({ username });

    if (user && await user.validatePassword(password)) {
      return user.username;
    } else {
      return null;
    }
  }

  async activationCode(activationCode: string, username: string): Promise<void> {
    try {
      const query = this.createQueryBuilder('user');
      query.where('user.activationCode = :activationCode AND user.username = :username',
        { activationCode, username });
      const found = await query.getOne();

      if (!found) {
          throw new NotFoundException(`User with activationCode "${activationCode}" not found`);
      }

      found.isActivated = true;
      await found.save();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  // async getSellersOnly(): Promise<SellersOnlyResponseDTO[]> {
  //   const query = this.createQueryBuilder('user')
  //     .select([
  //       'user.id',
  //       'user.username',
  //       'user.email',
  //       'user.firstname',
  //       'user.lastname',
  //       'user.isActivated',
  //       'user.activationCode',
  //       'user.address',
  //       'user.city',
  //       'user.province',
  //     ]);

  //   const found = await query.getMany();

  //   return found;
  // }

  async getUsers(
    gtUserssFilterDTO: GetUsersFilterDTO,
  ): Promise<Pagination<GetUsersResponseDTO>> {

    const { page, limit } = gtUserssFilterDTO;

    const checkPage =  (!page) ? 1 : page;

    const query = this.createQueryBuilder('user')
      .select([
        'user.id',
        'user.username',
        'user.email',
        'user.firstname',
        'user.lastname',
        'user.isActivated',
        'user.activationCode',
        'user.address',
        'user.city',
        'user.province',
        'user.mobileNumber',
        'user.role',
        'user.createdAt',
        'user.updatedAt',
      ]);

    const options = {
        page: checkPage,
        limit,
        route: ROUTES.AUTH.BASE +  ROUTES.AUTH.USERS,
    };

    try {
        return paginate<GetUsersResponseDTO>(query, options);
    } catch (error) {
        this.logger.error(`Failed to get Users`, error.stack);
        throw new InternalServerErrorException();
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
