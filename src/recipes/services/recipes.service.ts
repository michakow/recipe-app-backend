import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, ILike, Repository } from 'typeorm';
import { from, map } from 'rxjs';

import { CreateRecipeDTO, UpdateRecipeDTO } from '../dto';
import { RecipesEntity } from '../entities';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(RecipesEntity)
    private readonly recipeRepository: Repository<RecipesEntity>,
  ) {}

  getRecipes(
    name: string,
    sortBy: keyof FindOptionsOrder<RecipesEntity>,
    sortOrder: 'asc' | 'desc',
    page: number,
    limit: number,
  ) {
    const paginationOffset = (page - 1) * limit;

    return from(
      this.recipeRepository.findAndCount({
        where: { name: ILike(`%${name}%`) },
        order: { [sortBy]: sortOrder },
        skip: paginationOffset,
        take: limit,
      }),
    ).pipe(
      map(([data, total]) => ({
        data,
        page,
        limit,
        total,
      })),
    );
  }

  getRecipe(id: string) {
    return from(this.recipeRepository.findOneBy({ id }));
  }

  createRecipe(recipe: CreateRecipeDTO) {
    return from(this.recipeRepository.save(recipe));
  }

  updateRecipe(id: string, recipe: UpdateRecipeDTO) {
    return from(this.recipeRepository.update(id, recipe)).pipe(
      map((result) => {
        if (result.affected === 0) {
          return null;
        }

        return result;
      }),
    );
  }

  deleteRecipe(id: string) {
    return from(this.recipeRepository.delete(id)).pipe(
      map((result) => {
        if (result.affected === 0) {
          return null;
        }

        return result;
      }),
    );
  }
}
