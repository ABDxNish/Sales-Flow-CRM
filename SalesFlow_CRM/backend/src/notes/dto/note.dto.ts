import { IsOptional, IsString, MinLength } from 'class-validator';
export class NoteDto {
  @IsString() @MinLength(1) content: string;
  @IsOptional() @IsString() leadId?: string;
  @IsOptional() @IsString() dealId?: string;
}
