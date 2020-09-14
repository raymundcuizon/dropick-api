import { Module } from '@nestjs/common';
import { SettingPriceRateController } from './setting-price-rate.controller';
import { SettingPriceRateService } from './setting-price-rate.service';

@Module({
  controllers: [SettingPriceRateController],
  providers: [SettingPriceRateService]
})
export class SettingPriceRateModule {}
