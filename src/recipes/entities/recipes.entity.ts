import { IsArray, IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('recipes')
export class RecipesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsNotEmpty()
  @IsString()
  @Column('text')
  name: string;

  @IsNotEmpty()
  @IsString()
  @Column('text')
  description: string;

  @IsNotEmpty()
  @IsString()
  @Column('text')
  author: string;

  @IsNotEmpty()
  @IsDateString()
  @Column('timestamp', { name: 'created_date' })
  createdDate: Date;

  @IsNotEmpty()
  @IsDateString()
  @Column('timestamp', { name: 'updated_date' })
  updatedDate: Date;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @Column('text', { array: true })
  ingredients: string[];

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @Column('text', { array: true })
  steps: string[];
}
