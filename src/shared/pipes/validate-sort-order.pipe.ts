import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ValidateSortOrderPipe implements PipeTransform {
  transform(value: string) {
    if (value !== 'asc' && value !== 'desc') {
      throw new BadRequestException(`Invalid sortOrder value: ${value}.`);
    }
    return value;
  }
}
