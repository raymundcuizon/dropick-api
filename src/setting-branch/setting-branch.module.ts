import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { SettingBranchController } from './setting-branch.controller';
import { SettingBranchRepository } from './setting-branch.repository';
import { SettingBranchService } from './setting-branch.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SettingBranchRepository]),
    AuthModule,
  ],
  controllers: [SettingBranchController],
  providers: [SettingBranchService],
})
export class SettingBranchModule {}
