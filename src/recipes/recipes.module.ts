import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RatingsEntity, RecipesEntity } from './entities';
import { RatingsController, RecipesController } from './controllers';
import { RatingsService, RecipesService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([RecipesEntity, RatingsEntity])],
  controllers: [RecipesController, RatingsController],
  providers: [RecipesService, RatingsService],
})
export class RecipesModule {}
