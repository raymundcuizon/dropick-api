import { Test, TestingModule } from '@nestjs/testing';
import { SettingBranchService } from './setting-branch.service';

describe('SettingBranchService', () => {
  let service: SettingBranchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SettingBranchService],
    }).compile();

    service = module.get<SettingBranchService>(SettingBranchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
