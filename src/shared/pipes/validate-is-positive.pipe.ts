import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ValidateIsPositivePipe implements PipeTransform {
  transform(value: number, metadata: ArgumentMetadata) {
    const queryParamName = metadata.data;

    if (value <= 0) {
      throw new BadRequestException(
        `Value of ${queryParamName} must be positive: ${value}.`,
      );
    }

    return value;
  }
}
