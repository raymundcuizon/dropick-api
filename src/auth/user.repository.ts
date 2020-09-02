import { Repository, EntityRepository } from 'typeorm';
import { ConflictException, InternalServerErrorException, Logger } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { uid, suid } from 'rand-token';

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

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
