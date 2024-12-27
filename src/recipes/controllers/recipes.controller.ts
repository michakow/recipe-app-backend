import {
  Body,
  Controller,
  Delete,
  Get,
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

import { CreateRecipeDTO, UpdateRecipeDTO } from '../dto';
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
}
