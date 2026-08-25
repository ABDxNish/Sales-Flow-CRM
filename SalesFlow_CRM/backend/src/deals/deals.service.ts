import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deal } from './deal.entity';
import { DealHistory } from './deal-history.entity';
import { Company } from '../companies/company.entity';
import { Contact } from '../contacts/contact.entity';
import { User } from '../users/user.entity';
import { DealDto } from './dto/deal.dto';
import { DealQueryDto } from './dto/deal-query.dto';
import { DealStage } from '../common/enums';
import { NotificationsService } from '../notifications/notifications.service';
import { MailService } from '../integrations/mail.service';

@Injectable()
export class DealsService {
  constructor(
    @InjectRepository(Deal) private readonly repo: Repository<Deal>,
    @InjectRepository(DealHistory) private readonly historyRepo: Repository<DealHistory>,
    @InjectRepository(Company) private readonly companies: Repository<Company>,
    @InjectRepository(Contact) private readonly contacts: Repository<Contact>,
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly notifications: NotificationsService,
    private readonly mail: MailService,
  ) {}

  async findAll(query: DealQueryDto) {
    const qb = this.repo.createQueryBuilder('deal')
      .leftJoinAndSelect('deal.company', 'company')
      .leftJoinAndSelect('deal.contact', 'contact')
      .leftJoinAndSelect('deal.assignedTo', 'assignedTo');
    if (query.search) qb.andWhere('LOWER(deal.title) LIKE LOWER(:search)', { search: `%${query.search}%` });
    if (query.stage) qb.andWhere('deal.stage = :stage', { stage: query.stage });
    qb.orderBy('deal.createdAt', query.order).skip((query.page - 1) * query.limit).take(query.limit);
    const [data, total] = await qb.getManyAndCount();
    return { data, total, page: query.page, limit: query.limit };
  }

  async findPipeline() {
    const deals = await this.repo.find({ relations: ['company', 'contact', 'assignedTo'], order: { updatedAt: 'DESC' } });
    const stages = Object.values(DealStage);
    return stages.reduce((result, stage) => {
      result[stage] = deals.filter((deal) => deal.stage === stage);
      return result;
    }, {} as Record<string, Deal[]>);
  }

  async findOne(id: string) {
    const item = await this.repo.findOne({ where: { id }, relations: ['company', 'contact', 'assignedTo', 'notes', 'notes.createdBy', 'activities', 'history', 'history.changedBy'] });
    if (!item) throw new NotFoundException('Deal not found');
    return item;
  }

  private async relations(dto: DealDto) {
    return {
      company: dto.companyId ? await this.companies.findOne({ where: { id: dto.companyId } }) : null,
      contact: dto.contactId ? await this.contacts.findOne({ where: { id: dto.contactId } }) : null,
      assignedTo: dto.assignedToId ? await this.users.findOne({ where: { id: dto.assignedToId } }) : null,
    };
  }

  async create(dto: DealDto, changedById?: string) {
    const { companyId, contactId, assignedToId, ...data } = dto;
    const rel = await this.relations(dto);
    const item = await this.repo.save(this.repo.create({ ...data, ...rel }));
    const changedBy = changedById ? await this.users.findOne({ where: { id: changedById } }) : null;
    await this.historyRepo.save(this.historyRepo.create({ action: 'Deal created', toStage: item.stage, deal: item, changedBy }));
    if (item.assignedTo) {
      await this.notifications.create(item.assignedTo.id, 'New deal assigned', `${item.title} has been assigned to you.`);
      await this.mail.send(item.assignedTo.email, 'New CRM deal assigned', `${item.title} has been assigned to you.`);
    }
    return this.findOne(item.id);
  }

  async update(id: string, dto: DealDto, changedById?: string) {
    const item = await this.findOne(id);
    const oldAssignedId = item.assignedTo?.id;
    const { companyId, contactId, assignedToId, ...data } = dto;
    const rel = await this.relations(dto);
    Object.assign(item, data, rel);
    const saved = await this.repo.save(item);
    const changedBy = changedById ? await this.users.findOne({ where: { id: changedById } }) : null;
    await this.historyRepo.save(this.historyRepo.create({ action: 'Deal details updated', deal: saved, changedBy }));
    if (saved.assignedTo && saved.assignedTo.id !== oldAssignedId) {
      await this.notifications.create(saved.assignedTo.id, 'Deal assigned', `${saved.title} has been assigned to you.`);
    }
    return this.findOne(saved.id);
  }

  async updateStage(id: string, stage: DealStage, changedById?: string) {
    const item = await this.findOne(id);
    const fromStage = item.stage;
    if (fromStage === stage) return item;
    item.stage = stage;
    const saved = await this.repo.save(item);
    const changedBy = changedById ? await this.users.findOne({ where: { id: changedById } }) : null;
    await this.historyRepo.save(this.historyRepo.create({ action: 'Pipeline stage changed', fromStage, toStage: stage, deal: saved, changedBy }));
    if (saved.assignedTo) await this.notifications.create(saved.assignedTo.id, 'Deal stage updated', `${saved.title}: ${fromStage} → ${stage}`);
    return this.findOne(saved.id);
  }

  async remove(id: string) { const item = await this.findOne(id); await this.repo.remove(item); return { message: 'Deal deleted' }; }
}
