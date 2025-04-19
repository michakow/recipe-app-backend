import {
  Body,
  Controller,
  Get,
  Headers,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { Roles } from 'nest-keycloak-connect';

import {
  OptionalUUIDPipe,
  ValidateIsPositivePipe,
  ValidateSortOrderPipe,
} from 'src/shared';

import { RateRecipeDTO } from '../dto';

import { RatingsService } from '../services/ratings.service';

@Controller('ratings')
export class RatingsController {
  constructor(private ratingsService: RatingsService) {}

  @Get()
  @Roles({ roles: ['user'] })
  getRatings(
    @Query('userId', OptionalUUIDPipe) userId: string,
    @Query('recipeId', OptionalUUIDPipe) recipeId: string,
    // @Query('sortBy') sortBy: string,
    @Query('sortOrder', ValidateSortOrderPipe) sortOrder: 'asc' | 'desc',
    @Query('page', ParseIntPipe, ValidateIsPositivePipe) page: number,
    @Query('limit', ParseIntPipe, ValidateIsPositivePipe) limit: number,
  ) {
    return this.ratingsService.getRatings(
      userId,
      recipeId,
      // sortBy,
      sortOrder,
      page,
      limit,
    );
  }

  @Post()
  @Roles({ roles: ['user'] })
  rateRecipe(
    @Body() body: RateRecipeDTO,
    @Headers('authorization') token: string,
  ) {
    return this.ratingsService.rateRecipe(body, token);
  }
}
