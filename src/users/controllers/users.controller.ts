import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
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

    return this.usersService.getUser(id);
  }

  @Post('verify')
  @Roles({ roles: [] })
  verifyUser(@Headers('authorization') token: string) {
    return this.usersService.verifyUser(token, true);
  }

  @Patch(':id')
  @Roles({ roles: ['user'] })
  updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateUserDTO,
  ) {
    return this.usersService.updateUser(id, body);
  }

  @Delete(':id')
  @Roles({ roles: ['user'] })
  deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.deleteUser(id);
  }
}
