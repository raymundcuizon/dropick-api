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
        private settingBranchRepository: SettingPriceRateRepository,
      ) {}

    async createPriceRate(
        createPriceRateDto: CreatePriceRateDto,
    ): Promise<SettingPriceRate> {
        return this.settingBranchRepository.createPriceRate(createPriceRateDto);
    }

    async updatePriceRate(
        id: number,
        createPriceRateDto: CreatePriceRateDto,
    ): Promise<SettingPriceRate> {
        return this.settingBranchRepository.updatePriceRate(id, createPriceRateDto);
    }

    async getSinglePriceRate(id: number): Promise<SettingPriceRate> {
        return this.settingBranchRepository.getSinglePriceRate(id);
    }

    async getAllPriceRate(): Promise<SettingPriceRate[]> {
        return this.settingBranchRepository.getAllPriceRate();
    }
}
