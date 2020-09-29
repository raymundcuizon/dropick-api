import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePriceRateDto } from './dto/create-price-rate.dto';
import { SettingPriceRate } from './setting-price-rate.entity';
import { SettingPriceRateRepository } from './setting-price-rate.repositoty';

@Injectable()
export class SettingPriceRateService {
    private logger = new Logger('SettingBranchService');
    constructor(
        @InjectRepository(SettingPriceRateRepository)
        private settingPriceRateRepository: SettingPriceRateRepository,
      ) {}

    async createPriceRate(
        createPriceRateDto: CreatePriceRateDto,
    ): Promise<SettingPriceRate> {
        return this.settingPriceRateRepository.createPriceRate(createPriceRateDto);
    }

    async updatePriceRate(
        id: number,
        createPriceRateDto: CreatePriceRateDto,
    ): Promise<SettingPriceRate> {
        return this.settingPriceRateRepository.updatePriceRate(id, createPriceRateDto);
    }

    async getSinglePriceRate(id: number): Promise<SettingPriceRate> {
        return this.settingPriceRateRepository.getSinglePriceRate(id);
    }

    async getAllPriceRate(): Promise<SettingPriceRate[]> {
        return this.settingPriceRateRepository.getAllPriceRate();
    }

    async getAmountRateForItem(amount: number): Promise<number> {
        return this.settingPriceRateRepository.getAmountRateForItem(amount);
    }
}
