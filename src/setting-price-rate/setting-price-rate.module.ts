import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { SettingPriceRateController } from './setting-price-rate.controller';
import { SettingPriceRateRepository } from './setting-price-rate.repositoty';
import { SettingPriceRateService } from './setting-price-rate.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SettingPriceRateRepository]),
    AuthModule,
  ],
  controllers: [SettingPriceRateController],
  providers: [SettingPriceRateService],
})
export class SettingPriceRateModule {}
