import { Test, TestingModule } from '@nestjs/testing';
import { SettingBranchController } from './setting-branch.controller';

describe('SettingBranchController', () => {
  let controller: SettingBranchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SettingBranchController],
    }).compile();

    controller = module.get<SettingBranchController>(SettingBranchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
