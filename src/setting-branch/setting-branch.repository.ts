import { Logger } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { SettingBranch } from './setting-branch.entity';

@EntityRepository(SettingBranch)
export class SettingBranchRepository extends Repository<SettingBranch> {

    private logger = new Logger('SettingBranchRepository');

    async createBranch(): Promise<void> {
        return null;
    }

    async updateBranh(): Promise<void> {
        return null;
    }

    async getSingleBranch(): Promise<void> {
        return null;
    }

    async getAllBranch(): Promise<void> {
        return null;
    }

    async deleteBranch(): Promise<void> {
        return null;
    }
}
