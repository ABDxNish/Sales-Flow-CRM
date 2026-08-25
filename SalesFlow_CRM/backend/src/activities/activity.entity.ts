import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ActivityType } from '../common/enums';
import { User } from '../users/user.entity';
import { Lead } from '../leads/lead.entity';
import { Deal } from '../deals/deal.entity';

@Entity('activities')
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 160 })
  title: string;

  @Column({ type: 'enum', enum: ActivityType })
  type: ActivityType;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'timestamp', nullable: true })
  dueDate?: Date;

  @Column({ default: false })
  completed: boolean;

  @ManyToOne(() => User, (user) => user.activities, { nullable: true, onDelete: 'SET NULL' })
  assignedTo?: User | null;

  @ManyToOne(() => Lead, (lead) => lead.activities, { nullable: true, onDelete: 'CASCADE' })
  lead?: Lead | null;

  @ManyToOne(() => Deal, (deal) => deal.activities, { nullable: true, onDelete: 'CASCADE' })
  deal?: Deal | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
