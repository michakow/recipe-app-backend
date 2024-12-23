import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('int')
  recipes: number;

  @Column('timestamp', { name: 'created_date' })
  createdDate: Date;

  @Column('timestamp', { name: 'updated_date' })
  updatedDate: Date;
}
