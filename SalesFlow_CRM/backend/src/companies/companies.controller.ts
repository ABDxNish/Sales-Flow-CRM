import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompanyDto } from './dto/company.dto';
import { PaginationDto } from '../common/pagination.dto';
import { AuthGuard } from '../common/auth.guard';

@UseGuards(AuthGuard)
@Controller('companies')
export class CompaniesController {
  constructor(private readonly service: CompaniesService) {}
  @Get() all(@Query() query: PaginationDto) { return this.service.findAll(query); }
  @Get(':id') one(@Param('id') id: string) { return this.service.findOne(id); }
  @Post() create(@Body() dto: CompanyDto) { return this.service.create(dto); }
  @Patch(':id') update(@Param('id') id: string, @Body() dto: CompanyDto) { return this.service.update(id, dto); }
  @Delete(':id') remove(@Param('id') id: string) { return this.service.remove(id); }
}
