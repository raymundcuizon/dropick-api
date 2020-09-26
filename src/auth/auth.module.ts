import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import * as config from 'config';
import { TwilioModule } from '@lkaric/twilio-nestjs';
import { SendMeSms } from '../services/sendMeSms';

const twilioConfig = config.get('twilio');
const jwtConfig = config.get('jwt');

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({ secret: process.env.JWT_SECRET || jwtConfig.secret }),
    TypeOrmModule.forFeature([UserRepository]),
    TwilioModule.register({
      accountSid: process.env.TWILIO_accountSid || twilioConfig.accountSid,
      authToken: process.env.TWILIO_authToken || twilioConfig.authToken,
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    SendMeSms,
  ],
  exports: [
    JwtStrategy,
    PassportModule,
  ],
})
export class AuthModule {}
