import { Body, Controller, Get, Logger, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ROUTES } from '../constants/constants.json';
import { CreateBranchDto } from './dto/create-branch.dto';
import { SettingBranch } from './setting-branch.entity';
import { SettingBranchService } from './setting-branch.service';

@Controller(ROUTES.BRANCH.BASE)
@UseGuards(AuthGuard())
@ApiUnauthorizedResponse()
@ApiBearerAuth()
export class SettingBranchController {
    private logger = new Logger('SettingBranchController');
    constructor(private settingBranchService: SettingBranchService) {}

    @Post(ROUTES.BRANCH.CREATE)
    @ApiBody({ type: CreateBranchDto })
    createBranch(
        @Body() createBranchDto: CreateBranchDto,
    ): Promise<SettingBranch> {
        this.logger.verbose(`createBranch initiate`);
        return this.settingBranchService.createBranch(createBranchDto);
    }

    @Patch(ROUTES.BRANCH.UPDATE)
    @ApiBody({ type: CreateBranchDto })
    updateBranch(
        @Param('id') id: number,
        @Body() createBranchDto: CreateBranchDto,
    ): Promise<SettingBranch> {
        this.logger.verbose(`updateBranch initiate`);
        return this.settingBranchService.updateBranch(id, createBranchDto);

    }

    @Get(ROUTES.BRANCH.GET_SINGLE)
    getSingleBranch(
        @Param('id') id: number,
    ): Promise<SettingBranch> {
        this.logger.verbose(`getSingleBranch initiate`);
        return this.settingBranchService.getSingleBranch(id);

    }

    @Get(ROUTES.BRANCH.GET_ALL)
    getAllBranch(): Promise<SettingBranch[]> {
        this.logger.verbose(`getAllBranch initiate`);
        return this.settingBranchService.getAllBranch();

    }
}
