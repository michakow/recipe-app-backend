import { IsNotEmpty, IsString, IsArray } from 'class-validator';

export class CreateRecipeDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  author: string;

  @IsNotEmpty()
  @IsString()
  authorId: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  ingredients: string[];

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  steps: string[];
}
