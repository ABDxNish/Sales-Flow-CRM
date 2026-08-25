import { IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from '../../common/pagination.dto';
import { DealStage } from '../../common/enums';
export class DealQueryDto extends PaginationDto {
  @IsOptional() @IsEnum(DealStage) stage?: DealStage;
}
