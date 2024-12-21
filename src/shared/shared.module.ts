import { Global, Module } from '@nestjs/common';
import { ValidateSortByPipe, ValidateSortOrderPipe } from './pipes';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [ValidateSortOrderPipe, ValidateSortByPipe],
  exports: [ValidateSortOrderPipe, ValidateSortByPipe],
})
export class SharedModule {}
