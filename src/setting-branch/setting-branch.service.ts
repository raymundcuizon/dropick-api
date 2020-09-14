import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBranchDto } from './dto/create-branch.dto';
import { SettingBranch } from './setting-branch.entity';
import { SettingBranchRepository } from './setting-branch.repository';

@Injectable()
export class SettingBranchService {
    private logger = new Logger('SettingBranchService');
    constructor(
        @InjectRepository(SettingBranchRepository)
        private settingBranchRepository: SettingBranchRepository,
      ) {}

    async createBranch(
          createBranchDto: CreateBranchDto,
      ): Promise<SettingBranch> {
        return this.settingBranchRepository.createBranch(createBranchDto);
      }

    async updateBranch(
        id: number,
        createBranchDto: CreateBranchDto,
      ): Promise<SettingBranch> {
        return this.settingBranchRepository.updateBranch(id, createBranchDto);
    }

    async getSingleBranch(id: number): Promise<SettingBranch> {
        return this.settingBranchRepository.getSingleBranch(id);
    }

    async getAllBranch(): Promise<SettingBranch[]> {
        return this.settingBranchRepository.getAllBranch();
    }
}
