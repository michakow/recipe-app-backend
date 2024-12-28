import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Roles } from 'nest-keycloak-connect';

import {
  ValidateIsPositivePipe,
  ValidateSortByPipe,
  ValidateSortOrderPipe,
} from 'src/shared';

import { CreateRecipeDTO, RateRecipeDTO, UpdateRecipeDTO } from '../dto';
import { RecipesService } from '../services';
import { SortBy } from '../types';
import { sortOptions } from '../configs';

@Controller('recipes')
export class RecipesController {
  constructor(private recipesService: RecipesService) {}

  @Get()
  @Roles({ roles: ['user'] })
  getRecipes(
    @Query('name') name: string,
    @Query('sortBy', new ValidateSortByPipe([...sortOptions])) sortBy: SortBy,
    @Query('sortOrder', ValidateSortOrderPipe) sortOrder: 'asc' | 'desc',
    @Query('page', ParseIntPipe, ValidateIsPositivePipe) page: number,
    @Query('limit', ParseIntPipe, ValidateIsPositivePipe) limit: number,
  ) {
    return this.recipesService.getRecipes(name, sortBy, sortOrder, page, limit);
  }

  @Get(':id')
  @Roles({ roles: ['user'] })
  getRecipe(@Param('id', ParseUUIDPipe) id: string) {
    return this.recipesService.getRecipe(id);
  }

  @Post()
  @Roles({ roles: ['user'] })
  createRecipe(@Body() body: CreateRecipeDTO) {
    return this.recipesService.createRecipe(body);
  }

  @Patch(':id')
  @Roles({ roles: ['user'] })
  updateRecipe(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateRecipeDTO,
  ) {
    return this.recipesService.updateRecipe(id, body);
  }

  @Delete(':id')
  @Roles({ roles: ['user'] })
  deleteRecipe(@Param('id', ParseUUIDPipe) id: string) {
    return this.recipesService.deleteRecipe(id);
  }

  @Get(':id/ratings')
  @Roles({ roles: ['user'] })
  getRecipeRatings(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('sortOrder', ValidateSortOrderPipe) sortOrder: 'asc' | 'desc',
    @Query('page', ParseIntPipe, ValidateIsPositivePipe) page: number,
    @Query('limit', ParseIntPipe, ValidateIsPositivePipe) limit: number,
  ) {
    return this.recipesService.getRecipeRatings(id, sortOrder, page, limit);
  }

  @Get(':id/ratings/user')
  @Roles({ roles: ['user'] })
  getRecipeRatingByUserId(
    @Param('id', ParseUUIDPipe) id: string,
    @Headers('authorization') token: string,
  ) {
    return this.recipesService.getRecipeRatingByUserId(id, token);
  }

  @Post(':id/ratings')
  @Roles({ roles: ['user'] })
  rateRecipe(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() rating: RateRecipeDTO,
    @Headers('authorization') token: string,
  ) {
    return this.recipesService.rateRecipe(rating, token);
  }
}
