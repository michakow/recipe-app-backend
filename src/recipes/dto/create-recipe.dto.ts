import { Recipe } from '../models';

export type CreateRecipeDTO = Omit<Recipe, 'id'>;
