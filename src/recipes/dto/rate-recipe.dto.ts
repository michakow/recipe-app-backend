import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class RateRecipeDTO {
  @IsNotEmpty()
  @IsString()
  recipeId: string;

  @IsNotEmpty()
  @IsNumber()
  rating: number;

  @IsNotEmpty()
  @IsString()
  comment: string;
}
