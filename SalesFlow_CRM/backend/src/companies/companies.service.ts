import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './company.entity';
import { CompanyDto } from './dto/company.dto';
import { PaginationDto } from '../common/pagination.dto';

@Injectable()
export class CompaniesService {
  constructor(@InjectRepository(Company) private readonly repo: Repository<Company>) {}

  async findAll(query: PaginationDto) {
    const qb = this.repo.createQueryBuilder('company').leftJoinAndSelect('company.contacts', 'contacts');
    if (query.search) {
      qb.where('LOWER(company.name) LIKE LOWER(:search) OR LOWER(company.industry) LIKE LOWER(:search)', { search: `%${query.search}%` });
    }
    qb.orderBy('company.createdAt', query.order).skip((query.page - 1) * query.limit).take(query.limit);
    const [data, total] = await qb.getManyAndCount();
    return { data, total, page: query.page, limit: query.limit };
  }

  async findOne(id: string) {
    const item = await this.repo.findOne({ where: { id }, relations: ['contacts', 'leads', 'deals'] });
    if (!item) throw new NotFoundException('Company not found');
    return item;
  }

  create(dto: CompanyDto) { return this.repo.save(this.repo.create(dto)); }

  async update(id: string, dto: CompanyDto) {
    const item = await this.findOne(id);
    Object.assign(item, dto);
    return this.repo.save(item);
  }

  async remove(id: string) {
    const item = await this.findOne(id);
    await this.repo.remove(item);
    return { message: 'Company deleted' };
  }
}
