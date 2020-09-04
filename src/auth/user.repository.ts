import { Repository, EntityRepository } from 'typeorm';
import { ConflictException, InternalServerErrorException, Logger } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { uid, suid } from 'rand-token';
import { ROUTES } from '../constants/constants.json';
import { GetUserssFilterDTO } from './dto/getUsersFilter.dto';
import { Pagination, paginate } from 'nestjs-typeorm-paginate';
import { UserRoles } from './userrole-enum';
import { GetUsersResponseDTO } from './dto/getUsersResponse.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

  private logger = new Logger('UserRepository');

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
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
    user.activationCode = uid(65);
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

    try {
      await user.save();
    } catch (error) {
      this.logger.log(error);
      if (error.code === '23505') { // duplicate username
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { username, password } = authCredentialsDto;
    const user = await this.findOne({ username });

    if (user && await user.validatePassword(password)) {
      return user.username;
    } else {
      return null;
    }
  }

  async getUsers(
    gtUserssFilterDTO: GetUserssFilterDTO,
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
