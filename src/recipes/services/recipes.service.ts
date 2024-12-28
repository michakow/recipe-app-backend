import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, ILike, Repository } from 'typeorm';
import { from, map, switchMap } from 'rxjs';

import { TokenUserObject } from 'src/users';
import { getPaginationOffset, getValuesFromToken } from 'src/shared';

import { CreateRecipeDTO, RateRecipeDTO, UpdateRecipeDTO } from '../dto';
import { RatingsEntity, RecipesEntity } from '../entities';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(RecipesEntity)
    private readonly recipeRepository: Repository<RecipesEntity>,
    @InjectRepository(RatingsEntity)
    private readonly ratingRepository: Repository<RatingsEntity>,
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
    return from(this.recipeRepository.findOneBy({ id })).pipe(
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

  getRecipeRatings(
    recipeId: string,
    sortOrder: 'asc' | 'desc',
    page: number,
    limit: number,
  ) {
    return from(
      this.ratingRepository.findAndCount({
        where: { recipeId },
        order: { createdDate: sortOrder },
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

  getRecipeRatingByUserId(recipeId: string, userId: string) {
    return from(
      this.ratingRepository.find({ where: { recipeId, userId } }),
    ).pipe(
      map((result) => {
        if (!result.length) {
          throw new NotFoundException('Rating not found');
        }

        return result;
      }),
    );
  }

  rateRecipe(rating: RateRecipeDTO, token: string) {
    const userId = getValuesFromToken<TokenUserObject>(token, ['sub']).sub;

    const ratingWithUserId = {
      ...rating,
      userId,
    } as RatingsEntity;

    return from(
      this.ratingRepository.find({
        where: { recipeId: rating.recipeId, userId },
      }),
    ).pipe(
      switchMap((result) => {
        if (result.length) {
          return this.updateRating(result[0].id, ratingWithUserId);
        }

        return this.createRating(ratingWithUserId);
      }),
    );
  }

  private createRating(rating: RatingsEntity) {
    return from(this.ratingRepository.save(rating)).pipe(
      map((result) => result.id),
    );
  }

  private updateRating(id: string, rating: RatingsEntity) {
    return from(this.ratingRepository.update(id, rating)).pipe(
      map((result) => {
        if (!result.affected) {
          throw new NotFoundException('Rating not found');
        }
      }),
    );
  }
}
