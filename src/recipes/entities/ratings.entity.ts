import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Entity,
} from 'typeorm';
import { RecipesEntity } from './recipes.entity';

@Entity('ratings')
export class RatingsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { name: 'user_id' })
  userId: string;

  @ManyToOne(() => RecipesEntity, (recipe) => recipe.ratings)
  @JoinColumn({ name: 'recipe_id' })
  recipe: RecipesEntity;

  @Column('int')
  rating: number;

  @Column('text')
  comment: string;

  @CreateDateColumn({ name: 'created_date' })
  createdDate: Date;

  @UpdateDateColumn({ name: 'updated_date' })
  updatedDate: Date;
}
