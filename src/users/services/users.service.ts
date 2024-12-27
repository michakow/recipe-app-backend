import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, ILike, Repository } from 'typeorm';
import { from, map, of, switchMap } from 'rxjs';

import { UpdateUserDTO } from '../dto';
import { UsersEntity } from '../entities';
import { TokenUserObject } from '../types';
import { getValuesFromToken } from 'src/shared';

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
        where: { fullName: ILike(`%${name}%`) },
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
    return from(this.usersRepository.findOneBy({ id })).pipe(
      map((result) => {
        if (!result) {
          throw new NotFoundException('User not found');
        }

        return result;
      }),
    );
  }

  // TODO: move to shared/auth.service
  verifyUser(token: string, withCreate = false) {
    const tokenUserObject = getValuesFromToken<TokenUserObject>(token, [
      'sub',
      'preferred_username',
      'name',
      'given_name',
      'family_name',
      'email',
    ]);

    return from(
      this.usersRepository.findOneBy({ id: tokenUserObject.sub }),
    ).pipe(
      switchMap((result) => {
        if (result) {
          console.log('User found and verified');

          return of(result);
        }

        if (!result && withCreate) {
          console.log('User not found, try to create one');

          return this.createUser(tokenUserObject);
        }

        console.log('User not found');

        throw new UnauthorizedException('Account not exists');
      }),
    );
  }

  updateUser(id: string, user: UpdateUserDTO) {
    return from(this.usersRepository.update(id, user)).pipe(
      map((result) => {
        if (!result.affected) {
          throw new NotFoundException('User not found');
        }
      }),
    );
  }

  deleteUser(id: string) {
    return from(this.usersRepository.delete(id)).pipe(
      map((result) => {
        if (!result.affected) {
          throw new NotFoundException('User not found');
        }
      }),
    );
  }

  private createUser(tokenUserObject: TokenUserObject) {
    const newUser: UsersEntity = {
      id: tokenUserObject.sub,
      login: tokenUserObject.preferred_username,
      fullName: tokenUserObject.name,
      firstName: tokenUserObject.given_name,
      lastName: tokenUserObject.family_name,
      email: tokenUserObject.email,
      recipes: 0,
      createdDate: new Date(),
      updatedDate: new Date(),
    };

    console.log('creating new user');

    return from(this.usersRepository.save(newUser));
  }
}
