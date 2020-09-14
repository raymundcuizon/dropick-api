import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ROUTES } from '../constants/constants.json';

@Controller(ROUTES.BRANCH.BASE)
@UseGuards(AuthGuard())
@ApiUnauthorizedResponse()
@ApiBearerAuth()export class SettingPriceRateController {}
