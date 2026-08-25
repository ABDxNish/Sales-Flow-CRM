import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DealStage } from '../common/enums';
import { Deal } from './deal.entity';
import { User } from '../users/user.entity';

@Entity('deal_history')
export class DealHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  action: string;

  @Column({ type: 'enum', enum: DealStage, nullable: true })
  fromStage?: DealStage | null;

  @Column({ type: 'enum', enum: DealStage, nullable: true })
  toStage?: DealStage | null;

  @ManyToOne(() => Deal, (deal) => deal.history, { onDelete: 'CASCADE' })
  deal: Deal;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  changedBy?: User | null;

  @CreateDateColumn()
  createdAt: Date;
}
