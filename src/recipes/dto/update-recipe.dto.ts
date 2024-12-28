import { IsNotEmpty, IsString, IsArray } from 'class-validator';

export class UpdateRecipeDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  ingredients: string[];

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  steps: string[];
}
