import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, Repository } from 'typeorm';
import { from, map, switchMap } from 'rxjs';

import { getPaginationOffset, getUserIdFromToken } from 'src/shared';

import { RateRecipeDTO } from '../dto';
import { RatingsEntity } from '../entities';
import { RecipesService } from './recipes.service';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(RatingsEntity)
    private readonly ratingRepository: Repository<RatingsEntity>,
    private readonly recipesService: RecipesService,
  ) {}

  getRatings(
    userId: string,
    recipeId: string,
    // sortBy: keyof FindOptionsOrder<RatingsEntity>,
    sortOrder: 'asc' | 'desc',
    page: number,
    limit: number,
  ) {
    return from(
      this.ratingRepository.findAndCount({
        where: { userId, recipe: { id: recipeId } },
        // order: { [sortBy]: sortOrder },
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

  rateRecipe(rating: RateRecipeDTO, token: string) {
    const userId = getUserIdFromToken(token);

    return this.recipesService.getRecipe(rating.recipeId).pipe(
      switchMap((recipe) => {
        return from(
          this.ratingRepository.findOne({
            where: { recipe: { id: rating.recipeId }, userId },
          }),
        ).pipe(
          switchMap((existingRating) => {
            const ratingWithUserId: Partial<RatingsEntity> = {
              rating: rating.rating,
              comment: rating.comment,
              recipe,
              userId,
            };

            console.log(existingRating);

            if (existingRating) {
              console.log('aktualizacja recenzji');
              return this.updateRating(existingRating.id, ratingWithUserId);
            }

            console.log('dodanie recenzji');
            return this.createRating(ratingWithUserId);
          }),
        );
      }),
    );
  }

  private createRating(rating: Partial<RatingsEntity>) {
    return from(this.ratingRepository.save(rating)).pipe(
      map((result) => result.id),
    );
  }

  private updateRating(id: string, rating: Partial<RatingsEntity>) {
    return from(this.ratingRepository.update(id, rating)).pipe(
      map((result) => {
        if (!result.affected) {
          throw new NotFoundException('Rating not found');
        }
      }),
    );
  }
}
