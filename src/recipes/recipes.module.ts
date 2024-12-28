import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RecipesService } from './services';
import { RecipesController } from './controllers';
import { RatingsEntity, RecipesEntity } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([RecipesEntity, RatingsEntity])],
  controllers: [RecipesController],
  providers: [RecipesService],
})
export class RecipesModule {}
