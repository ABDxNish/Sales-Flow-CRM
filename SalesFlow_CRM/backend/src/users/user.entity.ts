import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserRole } from '../common/enums';
import { Lead } from '../leads/lead.entity';
import { Deal } from '../deals/deal.entity';
import { Activity } from '../activities/activity.entity';
import { Notification } from '../notifications/notification.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 120 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.SALES })
  role: UserRole;

  @Column({ nullable: true })
  phone?: string;

  @OneToMany(() => Lead, (lead) => lead.assignedTo)
  leads: Lead[];

  @OneToMany(() => Deal, (deal) => deal.assignedTo)
  deals: Deal[];

  @OneToMany(() => Activity, (activity) => activity.assignedTo)
  activities: Activity[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
