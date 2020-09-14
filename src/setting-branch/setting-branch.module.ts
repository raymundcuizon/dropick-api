import { Module } from '@nestjs/common';
import { SettingBranchController } from './setting-branch.controller';
import { SettingBranchService } from './setting-branch.service';

@Module({
  controllers: [SettingBranchController],
  providers: [SettingBranchService]
})
export class SettingBranchModule {}
