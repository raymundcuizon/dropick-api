import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderRepository } from './order.repository';
import { SettingPriceRateModule } from '../setting-price-rate/setting-price-rate.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderRepository]),
    AuthModule,
    SettingPriceRateModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
