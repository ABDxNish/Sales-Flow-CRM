import { IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from '../../common/pagination.dto';
import { LeadStatus } from '../../common/enums';
export class LeadQueryDto extends PaginationDto {
  @IsOptional() @IsEnum(LeadStatus) status?: LeadStatus;
}
