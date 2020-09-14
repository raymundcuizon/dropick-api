import { InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CreateBranchDto } from './dto/create-branch.dto';
import { SettingBranch } from './setting-branch.entity';

@EntityRepository(SettingBranch)
export class SettingBranchRepository extends Repository<SettingBranch> {

    private logger = new Logger('SettingBranchRepository');

    async createBranch(
        createBranchDto: CreateBranchDto,
    ): Promise<SettingBranch> {
        try {
            const { name, address, contactNumber } = createBranchDto;

            const saveBranch = new SettingBranch();
            saveBranch.name = name;
            saveBranch.address = address;
            saveBranch.contactNumber = contactNumber;

            return await saveBranch.save();

        } catch (error) {
            this.logger.error(`createBranch: failed to create`);
            throw new InternalServerErrorException();
        }
    }

    async updateBranch(
        id: number,
        createBranchDto: CreateBranchDto,
    ): Promise<SettingBranch> {
        try {
            const update = await this.getSingleBranch(id);

            update.name = createBranchDto.name;
            update.address = createBranchDto.address;
            update.contactNumber = createBranchDto.contactNumber;
            return await update.save();

        } catch (error) {
            this.logger.error(`updateBranch: failed to update`);
            throw new InternalServerErrorException();
        }
    }

    async getSingleBranch(id: number): Promise<SettingBranch> {
        const query = this.createQueryBuilder('branch');
        query.where('branch.id = :id', { id });

        const found = await query.getOne();
        if (!found) {
            throw new NotFoundException(`getSingleBranch with ID "${id}" not found`);
        }

        return found;

    }

    async getAllBranch(): Promise<SettingBranch[]> {
        return this.find();
    }

    async deleteBranch(): Promise<void> {
        return null;
    }
}
