import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { SettingBranchModule } from './setting-branch/setting-branch.module';
import { SettingPriceRateModule } from './setting-price-rate/setting-price-rate.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    OrdersModule,
    SettingBranchModule,
    SettingPriceRateModule,
  ],
})
export class AppModule {}
