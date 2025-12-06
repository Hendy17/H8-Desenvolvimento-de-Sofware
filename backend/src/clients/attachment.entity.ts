import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Client } from './client.entity';
import { User } from '../users/user.entity';

@Entity({ name: 'attachments' })
export class Attachment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Client, (client) => (client as any).attachments, { onDelete: 'CASCADE' })
  client: Client;

  @ManyToOne(() => User, (user) => (user as any).attachments, { nullable: true, onDelete: 'SET NULL' })
  uploadedBy?: User;

  @Column()
  filename: string;

  @Column()
  originalname: string;

  @Column({ nullable: true })
  contentType?: string;

  @Column({ type: 'bigint', nullable: true })
  size?: number;

  @Column()
  path: string;

  @CreateDateColumn()
  createdAt: Date;
}
