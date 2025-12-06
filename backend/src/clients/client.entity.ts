import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'clients' })
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  cnpj: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  address?: string;
}
