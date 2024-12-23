import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, ILike, Repository } from 'typeorm';
import { from, map } from 'rxjs';

import { UpdateUserDTO } from '../dto';
import { UsersEntity } from '../entities';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  getUsers(
    name: string,
    sortBy: keyof FindOptionsOrder<UsersEntity>,
    sortOrder: 'asc' | 'desc',
    page: number,
    limit: number,
  ) {
    const paginationOffset = (page - 1) * limit;

    return from(
      this.usersRepository.findAndCount({
        where: { name: ILike(`%${name}%`) },
        order: { [sortBy]: sortOrder },
        skip: paginationOffset,
        take: limit,
      }),
    ).pipe(
      map(([data, totalElements]) => ({
        data,
        page,
        limit,
        totalElements,
      })),
    );
  }

  getUser(id: string) {
    return from(this.usersRepository.findOneBy({ id }));
  }

  verifyUser(id: string) {
    return this.getUser(id).pipe(
      map((result) => {
        if (!result) {
          return null;
        }

        return result;
      }),
    );
  }

  updateUser(id: string, user: UpdateUserDTO) {
    return from(this.usersRepository.update(id, user)).pipe(
      map((result) => {
        if (result.affected === 0) {
          return null;
        }

        return result;
      }),
    );
  }

  deleteUser(id: string) {
    return from(this.usersRepository.delete(id)).pipe(
      map((result) => {
        if (result.affected === 0) {
          return null;
        }

        return result;
      }),
    );
  }
}
