import { IsEnum, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { Type } from 'class-transformer';
import { LeadStatus } from '../../common/enums';
export class LeadDto {
  @IsString() @MinLength(2) title: string;
  @IsOptional() @IsString() source?: string;
  @Type(() => Number) @IsNumber() @Min(0) estimatedValue: number;
  @IsOptional() @IsEnum(LeadStatus) status?: LeadStatus;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() companyId?: string;
  @IsOptional() @IsString() contactId?: string;
  @IsOptional() @IsString() assignedToId?: string;
}
