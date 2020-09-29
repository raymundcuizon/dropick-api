import { InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { from } from 'rxjs';
import { EntityRepository, Repository } from 'typeorm';
import { SettingPriceRate } from './setting-price-rate.entity';
import { CreatePriceRateDto } from './dto/create-price-rate.dto';

@EntityRepository(SettingPriceRate)
export class SettingPriceRateRepository extends Repository<SettingPriceRate> {

    private logger = new Logger('SettingPriceRateRepository');

    async createPriceRate(
        createPriceRateDto: CreatePriceRateDto,
    ): Promise<SettingPriceRate> {
        try {
            const { rateFrom, rateTo, rate } = createPriceRateDto;

            const savePriceRate = new SettingPriceRate();
            savePriceRate.rateFrom = rateFrom;
            savePriceRate.rateTo = rateTo;
            savePriceRate.rate = rate;

            return await savePriceRate.save();

        } catch (error) {
            this.logger.error(`createPriceRate: failed to create`);
            throw new InternalServerErrorException();
        }
    }

    async updatePriceRate(
        id: number,
        createPriceRateDto: CreatePriceRateDto,
    ): Promise<SettingPriceRate> {
        try {
            const update = await this.getSinglePriceRate(id);

            update.rate = createPriceRateDto.rate;
            update.rateFrom = createPriceRateDto.rateFrom;
            update.rateTo = createPriceRateDto.rateTo;
            return await update.save();
        } catch (error) {
            this.logger.error(`updatePriceRate: failed to update`);
            throw new InternalServerErrorException();
        }
    }

    async getSinglePriceRate(id: number): Promise<SettingPriceRate> {
        const query = this.createQueryBuilder('priceRate');
        query.where('priceRate.id = :id', { id });

        const found = await query.getOne();
        if (!found) {
            throw new NotFoundException(`getSinglePriceRate with ID "${id}" not found`);
        }

        return found;
    }

    async getAllPriceRate(): Promise<SettingPriceRate[]> {
        return this.find();
    }

    async getAmountRateForItem(amount: number): Promise<number> {
        this.logger.log(`initiate getAmountRateForItem: ${amount}`);
        const query = this.createQueryBuilder('priceRate');
        query.where('priceRate.rateFrom <= :amount AND priceRate.rateTo >= :amount', { amount });

        const found = await query.getOne();

        if (found) {
            return found.rate;
        }
        return 0;

    }

    async deletePriceRate(): Promise<void> {
        return null;
    }
}
