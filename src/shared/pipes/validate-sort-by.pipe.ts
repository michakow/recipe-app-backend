import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ValidateSortByPipe<T> implements PipeTransform {
  constructor(private readonly sortOptions?: T[]) {
    this.sortOptions = sortOptions || [];
  }

  transform(value: string) {
    if (!this.sortOptions.length) return value;

    if (!this.sortOptions.includes(value as T)) {
      throw new BadRequestException(`Invalid sortBy value: ${value}.`);
    }

    return value;
  }
}
