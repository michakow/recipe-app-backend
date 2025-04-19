import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, ILike, Repository } from 'typeorm';
import { from, map } from 'rxjs';

import { getPaginationOffset } from 'src/shared';

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
    return from(
      this.recipeRepository.findAndCount({
        where: { name: ILike(`%${name}%`) },
        order: { [sortBy]: sortOrder },
        skip: getPaginationOffset(page, limit),
        take: limit,
      }),
    ).pipe(
      map(([data, totalElements]) => ({
        data,
        page,
        limit,
        totalElements,
      })),
    );
  }

  getRecipe(id: string) {
    return from(
      this.recipeRepository.findOne({ where: { id }, relations: ['ratings'] }),
    ).pipe(
      map((result) => {
        if (!result) {
          throw new NotFoundException('Recipe not found');
        }

        return result;
      }),
    );
  }

  createRecipe(recipe: CreateRecipeDTO) {
    const newRecipe: Omit<RecipesEntity, 'id'> = {
      ...recipe,
      ratings: [],
      createdDate: new Date(),
      updatedDate: new Date(),
    };
    return from(this.recipeRepository.save(newRecipe)).pipe(
      map((result) => result.id),
    );
  }

  updateRecipe(id: string, recipe: UpdateRecipeDTO) {
    const updatedRecipe = {
      ...recipe,
      updatedDate: new Date(),
    } as RecipesEntity;

    return from(this.recipeRepository.update(id, updatedRecipe)).pipe(
      map((result) => {
        if (!result.affected) {
          throw new NotFoundException('Recipe not found');
        }
      }),
    );
  }

  deleteRecipe(id: string) {
    return from(this.recipeRepository.delete(id)).pipe(
      map((result) => {
        if (!result.affected) {
          throw new NotFoundException('Recipe not found');
        }
      }),
    );
  }
}
