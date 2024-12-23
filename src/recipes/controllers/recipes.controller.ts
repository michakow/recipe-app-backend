import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { map } from 'rxjs';
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
    console.log('get all');

    return this.recipesService.getRecipes(name, sortBy, sortOrder, page, limit);
  }

  @Get(':id')
  @Roles({ roles: ['user'] })
  getRecipe(@Param('id', ParseUUIDPipe) id: string) {
    console.log('get id');

    return this.recipesService.getRecipe(id).pipe(
      map((result) => {
        if (!result) {
          throw new NotFoundException('Recipe not found');
        }

        return result;
      }),
    );
  }

  @Post()
  @Roles({ roles: ['user'] })
  createRecipe(@Body() body: CreateRecipeDTO) {
    console.log('create');

    return this.recipesService.createRecipe(body);
  }

  @Patch(':id')
  @Roles({ roles: ['user'] })
  updateRecipe(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateRecipeDTO,
  ) {
    console.log('update');

    return this.recipesService.updateRecipe(id, body).pipe(
      map((result) => {
        if (!result) {
          throw new NotFoundException('Recipe not found');
        }

        return `Recipe ${id} updated`;
      }),
    );
  }

  @Delete(':id')
  @Roles({ roles: ['user'] })
  deleteRecipe(@Param('id', ParseUUIDPipe) id: string) {
    console.log('delete');

    return this.recipesService.deleteRecipe(id).pipe(
      map((result) => {
        if (!result) {
          throw new NotFoundException('Recipe not found');
        }

        return `Recipe ${id} deleted`;
      }),
    );
  }
}
