import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { map } from 'rxjs';

import { CreateRecipeDTO, UpdateRecipeDTO } from '../dto';
import { RecipesService } from '../services';
import { SortBy } from '../types';

@Controller('recipes')
export class RecipesController {
  constructor(private recipesService: RecipesService) {}

  @Get()
  getRecipes(
    @Query('name') name: string,
    @Query('sortBy') sortBy: SortBy,
    @Query('sortOrder') sortOrder: 'asc' | 'desc',
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    console.log('get all');

    return this.recipesService.getRecipes(name, sortBy, sortOrder, page, limit);
  }

  @Get(':id')
  getRecipe(@Param('id') id: string) {
    console.log('get id');

    return this.recipesService.getRecipe(id);
  }

  @Post()
  createRecipe(@Body() body: CreateRecipeDTO) {
    console.log('create');

    return this.recipesService.createRecipe(body);
  }

  @Patch(':id')
  updateRecipe(@Param('id') id: string, @Body() body: UpdateRecipeDTO) {
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
  deleteRecipe(@Param('id') id: string) {
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
