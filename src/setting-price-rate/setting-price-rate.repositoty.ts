import { Logger } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { SettingPriceRate } from './setting-price-rate.entity';

@EntityRepository(SettingPriceRate)
export class SettingPriceRateRepository extends Repository<SettingPriceRate> {

    private logger = new Logger('SettingPriceRateRepository');

    async createPriceRate(): Promise<void> {
        return null;
    }

    async updateBranh(): Promise<void> {
        return null;
    }

    async getSinglePriceRate(): Promise<void> {
        return null;
    }

    async getAllPriceRate(): Promise<void> {
        return null;
    }

    async deletePriceRate(): Promise<void> {
        return null;
    }
}
