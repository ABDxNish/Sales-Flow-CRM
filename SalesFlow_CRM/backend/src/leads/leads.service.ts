import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead } from './lead.entity';
import { Company } from '../companies/company.entity';
import { Contact } from '../contacts/contact.entity';
import { User } from '../users/user.entity';
import { LeadDto } from './dto/lead.dto';
import { LeadQueryDto } from './dto/lead-query.dto';
import { LeadStatus, DealStage } from '../common/enums';
import { NotificationsService } from '../notifications/notifications.service';
import { DealsService } from '../deals/deals.service';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead) private readonly repo: Repository<Lead>,
    @InjectRepository(Company) private readonly companies: Repository<Company>,
    @InjectRepository(Contact) private readonly contacts: Repository<Contact>,
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly notifications: NotificationsService,
    private readonly deals: DealsService,
  ) {}

  async findAll(query: LeadQueryDto) {
    const qb = this.repo.createQueryBuilder('lead').leftJoinAndSelect('lead.company','company').leftJoinAndSelect('lead.contact','contact').leftJoinAndSelect('lead.assignedTo','assignedTo');
    if (query.search) qb.andWhere('LOWER(lead.title) LIKE LOWER(:search)', { search: `%${query.search}%` });
    if (query.status) qb.andWhere('lead.status = :status', { status: query.status });
    qb.orderBy('lead.createdAt', query.order).skip((query.page-1)*query.limit).take(query.limit);
    const [data,total]=await qb.getManyAndCount();
    return { data,total,page:query.page,limit:query.limit };
  }

  async findOne(id:string) {
    const item=await this.repo.findOne({ where:{id}, relations:['company','contact','assignedTo','notes','notes.createdBy','activities'] });
    if(!item) throw new NotFoundException('Lead not found');
    return item;
  }

  private async relations(dto:LeadDto) {
    return {
      company: dto.companyId ? await this.companies.findOne({where:{id:dto.companyId}}) : null,
      contact: dto.contactId ? await this.contacts.findOne({where:{id:dto.contactId}}) : null,
      assignedTo: dto.assignedToId ? await this.users.findOne({where:{id:dto.assignedToId}}) : null,
    };
  }

  async create(dto:LeadDto) {
    const {companyId,contactId,assignedToId,...data}=dto;
    const item=await this.repo.save(this.repo.create({...data,...await this.relations(dto)}));
    if(item.assignedTo) await this.notifications.create(item.assignedTo.id,'New lead assigned',`${item.title} has been assigned to you.`);
    return this.findOne(item.id);
  }

  async update(id:string,dto:LeadDto) {
    const item=await this.findOne(id);
    const oldAssignedId=item.assignedTo?.id;
    const {companyId,contactId,assignedToId,...data}=dto;
    Object.assign(item,data,await this.relations(dto));
    const saved=await this.repo.save(item);
    if(saved.assignedTo && saved.assignedTo.id!==oldAssignedId) await this.notifications.create(saved.assignedTo.id,'Lead assigned',`${saved.title} has been assigned to you.`);
    return this.findOne(saved.id);
  }

  async convert(id:string,currentUserId:string) {
    const lead=await this.findOne(id);
    if(lead.status===LeadStatus.CONVERTED) throw new BadRequestException('Lead is already converted');
    const deal=await this.deals.create({
      title: lead.title,
      value: Number(lead.estimatedValue),
      stage: DealStage.NEW,
      description: lead.description,
      companyId: lead.company?.id,
      contactId: lead.contact?.id,
      assignedToId: lead.assignedTo?.id,
    },currentUserId);
    lead.status=LeadStatus.CONVERTED;
    await this.repo.save(lead);
    return { message:'Lead converted to deal',deal };
  }

  async remove(id:string){const item=await this.findOne(id);await this.repo.remove(item);return{message:'Lead deleted'};}
}
