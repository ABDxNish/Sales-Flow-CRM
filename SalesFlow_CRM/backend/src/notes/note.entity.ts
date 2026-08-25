import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Lead } from '../leads/lead.entity';
import { Deal } from '../deals/deal.entity';
import { User } from '../users/user.entity';

@Entity('notes')
export class Note {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => Lead, (lead) => lead.notes, { nullable: true, onDelete: 'CASCADE' })
  lead?: Lead | null;

  @ManyToOne(() => Deal, (deal) => deal.notes, { nullable: true, onDelete: 'CASCADE' })
  deal?: Deal | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  createdBy?: User | null;

  @CreateDateColumn()
  createdAt: Date;
}
