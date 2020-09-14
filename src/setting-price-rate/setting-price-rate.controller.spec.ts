import { Test, TestingModule } from '@nestjs/testing';
import { SettingPriceRateController } from './setting-price-rate.controller';

describe('SettingPriceRateController', () => {
  let controller: SettingPriceRateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SettingPriceRateController],
    }).compile();

    controller = module.get<SettingPriceRateController>(SettingPriceRateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
