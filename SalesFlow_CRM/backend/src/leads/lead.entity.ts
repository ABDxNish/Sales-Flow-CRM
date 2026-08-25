import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { LeadStatus } from '../common/enums';
import { Company } from '../companies/company.entity';
import { Contact } from '../contacts/contact.entity';
import { User } from '../users/user.entity';
import { Note } from '../notes/note.entity';
import { Activity } from '../activities/activity.entity';

@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 150 })
  title: string;

  @Column({ nullable: true })
  source?: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  estimatedValue: number;

  @Column({ type: 'enum', enum: LeadStatus, default: LeadStatus.NEW })
  status: LeadStatus;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @ManyToOne(() => Company, (company) => company.leads, { nullable: true, onDelete: 'SET NULL' })
  company?: Company | null;

  @ManyToOne(() => Contact, (contact) => contact.leads, { nullable: true, onDelete: 'SET NULL' })
  contact?: Contact | null;

  @ManyToOne(() => User, (user) => user.leads, { nullable: true, onDelete: 'SET NULL' })
  assignedTo?: User | null;

  @OneToMany(() => Note, (note) => note.lead)
  notes: Note[];

  @OneToMany(() => Activity, (activity) => activity.lead)
  activities: Activity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
