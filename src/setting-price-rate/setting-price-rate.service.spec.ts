import { Test, TestingModule } from '@nestjs/testing';
import { SettingPriceRateService } from './setting-price-rate.service';

describe('SettingPriceRateService', () => {
  let service: SettingPriceRateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SettingPriceRateService],
    }).compile();

    service = module.get<SettingPriceRateService>(SettingPriceRateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
