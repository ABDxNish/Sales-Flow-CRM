import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deal } from './deal.entity';
import { DealHistory } from './deal-history.entity';
import { Company } from '../companies/company.entity';
import { Contact } from '../contacts/contact.entity';
import { User } from '../users/user.entity';
import { DealsService } from './deals.service';
import { DealsController } from './deals.controller';
import { NotificationsModule } from '../notifications/notifications.module';
@Module({
  imports: [TypeOrmModule.forFeature([Deal, DealHistory, Company, Contact, User]), NotificationsModule],
  providers: [DealsService], controllers: [DealsController], exports: [DealsService],
})
export class DealsModule {}
