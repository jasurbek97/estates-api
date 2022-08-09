import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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

  async findById(id: string) {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new NotFoundException('User Not Found!');
    }
    return user;
  }

  async verifyUser(id: string) {
    const [user] = await this.userRepo.verifyUser(id);
    if (!user) {
      throw new InternalServerErrorException('User Verify Error!');
    }
    return user;
  }

  async create(data: UserInterface) {
    const user = await this.userRepo.findOne(data.phone);
    if (user) {
      throw new BadRequestException('User Already Exist');
    }
    return this.userRepo.create(data);
  }
}
