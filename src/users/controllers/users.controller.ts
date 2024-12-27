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
  Req,
} from '@nestjs/common';
import { map } from 'rxjs';
import { Roles } from 'nest-keycloak-connect';

import {
  ValidateIsPositivePipe,
  ValidateSortByPipe,
  ValidateSortOrderPipe,
} from 'src/shared';

import { UpdateUserDTO } from '../dto';
import { UsersService } from '../services';
import { SortBy } from '../types';
import { sortOptions } from '../configs';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Roles({ roles: ['user'] })
  getUsers(
    @Query('name') name: string,
    @Query('sortBy', new ValidateSortByPipe([...sortOptions])) sortBy: SortBy,
    @Query('sortOrder', ValidateSortOrderPipe) sortOrder: 'asc' | 'desc',
    @Query('page', ParseIntPipe, ValidateIsPositivePipe) page: number,
    @Query('limit', ParseIntPipe, ValidateIsPositivePipe) limit: number,
  ) {
    console.log('get all');

    return this.usersService.getUsers(name, sortBy, sortOrder, page, limit);
  }

  @Get(':id')
  @Roles({ roles: ['user'] })
  getUser(@Param('id', ParseUUIDPipe) id: string) {
    console.log('get id');

    return this.usersService.getUser(id).pipe(
      map((result) => {
        if (!result) {
          throw new NotFoundException('User not found');
        }

        return result;
      }),
    );
  }

  @Post('verify')
  @Roles({ roles: ['user'] })
  verifyUser(@Req() req: Request) {
    console.log('verify');

    const token = req.headers['authorization'] as string;

    return this.usersService.verifyUser(token, true);
  }

  @Patch(':id')
  @Roles({ roles: ['user'] })
  updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateUserDTO,
  ) {
    console.log('update');

    return this.usersService.updateUser(id, body).pipe(
      map((result) => {
        if (!result) {
          throw new NotFoundException('User not found');
        }

        return `User ${id} updated`;
      }),
    );
  }

  @Delete(':id')
  @Roles({ roles: ['user'] })
  deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    console.log('delete');

    return this.usersService.deleteUser(id).pipe(
      map((result) => {
        if (!result) {
          throw new NotFoundException('User not found');
        }

        return `User ${id} deleted`;
      }),
    );
  }
}
