import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { User } from '../users/user.entity';
import { RealtimeService } from '../integrations/realtime.service';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification) private readonly repo: Repository<Notification>,
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly realtime: RealtimeService,
  ) {}

  async create(userId: string, title: string, message: string) {
    const user = await this.users.findOne({ where: { id: userId } });
    if (!user) return;
    const notification = await this.repo.save(this.repo.create({ user, title, message }));
    await this.realtime.notifyUser(userId, { id: notification.id, title, message, createdAt: notification.createdAt });
    return notification;
  }

  findMine(userId: string) {
    return this.repo.find({ where: { user: { id: userId } }, order: { createdAt: 'DESC' }, take: 50 });
  }

  async markRead(id: string, userId: string) {
    const item = await this.repo.findOne({ where: { id, user: { id: userId } } });
    if (!item) throw new NotFoundException('Notification not found');
    item.isRead = true;
    return this.repo.save(item);
  }

  async markAllRead(userId: string) {
    await this.repo.createQueryBuilder().update(Notification).set({ isRead: true }).where('"userId" = :userId', { userId }).execute();
    return { message: 'All notifications marked as read' };
  }
}
