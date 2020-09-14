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
import { SendMeSms } from 'src/services/sendMeSms';

const jwtConfig = config.get('jwt');

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || jwtConfig.secret,
      signOptions: {
        expiresIn: jwtConfig.expiresIn,
      },
    }),
    TypeOrmModule.forFeature([UserRepository]),
    TwilioModule.register({
      accountSid: 'ACc7b97db24e1c3320304750efb88c3b7d',
      authToken: 'e07b77bf6e89a8bc779fc6aec2ffb548',
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
