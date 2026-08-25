import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { DealStage } from '../common/enums';
import { Company } from '../companies/company.entity';
import { Contact } from '../contacts/contact.entity';
import { User } from '../users/user.entity';
import { Note } from '../notes/note.entity';
import { Activity } from '../activities/activity.entity';
import { DealHistory } from './deal-history.entity';

@Entity('deals')
export class Deal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 160 })
  title: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  value: number;

  @Column({ type: 'enum', enum: DealStage, default: DealStage.NEW })
  stage: DealStage;

  @Column({ type: 'date', nullable: true })
  expectedCloseDate?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @ManyToOne(() => Company, (company) => company.deals, { nullable: true, onDelete: 'SET NULL' })
  company?: Company | null;

  @ManyToOne(() => Contact, (contact) => contact.deals, { nullable: true, onDelete: 'SET NULL' })
  contact?: Contact | null;

  @ManyToOne(() => User, (user) => user.deals, { nullable: true, onDelete: 'SET NULL' })
  assignedTo?: User | null;

  @OneToMany(() => Note, (note) => note.deal)
  notes: Note[];

  @OneToMany(() => Activity, (activity) => activity.deal)
  activities: Activity[];

  @OneToMany(() => DealHistory, (history) => history.deal)
  history: DealHistory[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
