import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './contact.entity';
import { Company } from '../companies/company.entity';
import { ContactDto } from './dto/contact.dto';
import { PaginationDto } from '../common/pagination.dto';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact) private readonly repo: Repository<Contact>,
    @InjectRepository(Company) private readonly companies: Repository<Company>,
  ) {}

  async findAll(query: PaginationDto) {
    const qb = this.repo.createQueryBuilder('contact').leftJoinAndSelect('contact.company', 'company');
    if (query.search) {
      qb.where('LOWER(contact.firstName) LIKE LOWER(:search) OR LOWER(contact.lastName) LIKE LOWER(:search) OR LOWER(contact.email) LIKE LOWER(:search)', { search: `%${query.search}%` });
    }
    qb.orderBy('contact.createdAt', query.order).skip((query.page - 1) * query.limit).take(query.limit);
    const [data, total] = await qb.getManyAndCount();
    return { data, total, page: query.page, limit: query.limit };
  }

  async findOne(id: string) {
    const item = await this.repo.findOne({ where: { id }, relations: ['company'] });
    if (!item) throw new NotFoundException('Contact not found');
    return item;
  }

  async create(dto: ContactDto) {
    const { companyId, ...data } = dto;
    const item = this.repo.create(data);
    if (companyId) item.company = await this.companies.findOne({ where: { id: companyId } });
    return this.repo.save(item);
  }

  async update(id: string, dto: ContactDto) {
    const item = await this.findOne(id);
    const { companyId, ...data } = dto;
    Object.assign(item, data);
    item.company = companyId ? await this.companies.findOne({ where: { id: companyId } }) : null;
    return this.repo.save(item);
  }

  async remove(id: string) { const item = await this.findOne(id); await this.repo.remove(item); return { message: 'Contact deleted' }; }
}
