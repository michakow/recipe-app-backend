import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class UpdateUserDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  recipes: number;
}
