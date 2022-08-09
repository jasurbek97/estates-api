import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserInterface } from './interfaces/user.interface';
import { UserRepo } from './user.repo';

@Injectable()
export class UsersService {
  @Inject() private readonly userRepo: UserRepo;

  async findOne(phone: string) {
    const user = await this.userRepo.findOne(phone);
    if (!user) {
      throw new NotFoundException('User Not Found!');
    }
    return user;
  }

  create(data: UserInterface) {
    return this.userRepo.create(data);
  }
}
