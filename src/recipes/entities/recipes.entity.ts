import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('recipes')
export class RecipesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('text')
  description: string;

  @Column('text')
  author: string;

  @Column('uuid', { name: 'author_id' })
  authorId: string;

  @Column('timestamp', { name: 'created_date' })
  createdDate: Date;

  @Column('timestamp', { name: 'updated_date' })
  updatedDate: Date;

  @Column('text', { array: true })
  ingredients: string[];

  @Column('text', { array: true })
  steps: string[];
}
