import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { compareTwoDate, encodePhone, encrypt } from '@utils';
import { UserInterface } from '../users/interfaces/user.interface';
import { OneTimeCodesRepo } from './repo/one-time-codes.repo';
import { getPayload } from './payload';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private oneTimeCodesRepo: OneTimeCodesRepo,
  ) {}

  async login(user: any) {
    const payload = { phone: user.phone, user_id: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register({ password, ...data }: UserInterface) {
    const [user]: UserInterface[] = await this.usersService.create({
      password: await encrypt(password),
      ...data,
    });

    if (!user) {
      throw new InternalServerErrorException('User Creating Error!');
    }

    if (!user.is_verified) {
      const [generated]: Record<'id' | 'otp' | 'code', string>[] =
        await this.oneTimeCodesRepo.generate(user.id);
      if (!generated) {
        throw new InternalServerErrorException('Otp Code Generating Error!');
      }
      //TODO send SMS
      user['code'] = generated.code;
      console.log('otp', generated.otp);
    }
    user['phone'] = encodePhone(user.phone);
    delete user.id;
    return {
      ...user,
      status: 'otp_send',
      seconds: user.verification_attempt * 60,
    };
  }

  async verify({ code, otp }: Record<'otp' | 'code', string>) {
    const generated: Record<'expired_at' | 'user_id' | 'otp', string> =
      await this.oneTimeCodesRepo.verify(code, otp);
    console.log('generated', generated);
    return generated;
    if (!generated || !compareTwoDate(generated.expired_at)) {
      throw new InternalServerErrorException('Invalid Code Retry Later!');
    }

    const { user_id } = generated;
    const user: UserInterface = await this.usersService.findById(user_id);
    const updated = await this.usersService.verifyUser(user_id);
    console.log(updated);
    user['is_verified'] = true;
    const payload = getPayload(user);
    const token = this.jwtService.sign(payload);
    return {
      access_token: token,
    };
  }
}
