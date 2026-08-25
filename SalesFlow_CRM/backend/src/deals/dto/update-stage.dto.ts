import { IsEnum } from 'class-validator';
import { DealStage } from '../../common/enums';
export class UpdateStageDto { @IsEnum(DealStage) stage: DealStage; }
