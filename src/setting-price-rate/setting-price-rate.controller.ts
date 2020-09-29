import { Body, Controller, Get, Logger, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ROUTES } from '../constants/constants.json';
import { CreatePriceRateDto } from './dto/create-price-rate.dto';
import { SettingPriceRate } from './setting-price-rate.entity';
import { SettingPriceRateService } from './setting-price-rate.service';

@Controller(ROUTES.PRICE_RATE.BASE)
@UseGuards(AuthGuard())
@ApiUnauthorizedResponse()
@ApiBearerAuth()
export class SettingPriceRateController {
    private logger = new Logger('SettingPriceRateController');
    constructor(private settingPriceRateService: SettingPriceRateService) {}

    @Post(ROUTES.PRICE_RATE.CREATE)
    @ApiBody({ type: CreatePriceRateDto })
    createPriceRate(
        @Body() createPriceRateDto: CreatePriceRateDto,
    ): Promise<SettingPriceRate> {
        this.logger.verbose(`createPriceRate initiate`);
        return this.settingPriceRateService.createPriceRate(createPriceRateDto);
    }

    @Patch(ROUTES.PRICE_RATE.UPDATE)
    @ApiBody({ type: CreatePriceRateDto })
    updatePriceRate(
        @Param('id') id: number,
        @Body() createPriceRateDto: CreatePriceRateDto,
    ): Promise<SettingPriceRate> {
        this.logger.verbose(`updatePriceRate initiate`);
        return this.settingPriceRateService.updatePriceRate(id, createPriceRateDto);

    }

    @Get(ROUTES.PRICE_RATE.GET_SINGLE)
    getSinglePriceRate(
        @Param('id') id: number,
    ): Promise<SettingPriceRate> {
        this.logger.verbose(`getSinglePriceRate initiate`);
        return this.settingPriceRateService.getSinglePriceRate(id);

    }

    @Get(ROUTES.PRICE_RATE.GET_ALL)
    getAllPriceRate(): Promise<SettingPriceRate[]> {
        this.logger.verbose(`getAllPriceRate initiate`);
        return this.settingPriceRateService.getAllPriceRate();

    }

    @Get(ROUTES.PRICE_RATE.CHECK_FOR_PRICE_RATE)
    getAmountRateForItem(
        @Param('amount') amount: number,
    ): Promise<number> {
        this.logger.verbose(`getAllPriceRate initiate`);
        return this.settingPriceRateService.getAmountRateForItem(amount);

    }
}
