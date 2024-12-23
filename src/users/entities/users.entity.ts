import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  login: string;

  @Column('text', { name: 'full_name' })
  fullName: string;

  @Column('text', { name: 'first_name' })
  firstName: string;

  @Column('text', { name: 'last_name' })
  lastName: string;

  @Column('text')
  email: string;

  @Column('int')
  recipes: number;

  @Column('timestamp', { name: 'created_date' })
  createdDate: Date;

  @Column('timestamp', { name: 'updated_date' })
  updatedDate: Date;
}
