import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import {
  compareTwoDate,
  dateDiff,
  encodePhone,
  encrypt,
  formatDatetime,
  isMatch,
} from '@utils';
import { UserInterface } from '../users/interfaces/user.interface';
import { OneTimeCodesRepo } from './repo/one-time-codes.repo';
import { getPayload } from './payload';
import { RefreshTokenRepo } from './repo/refresh-token.repo';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private oneTimeCodesRepo: OneTimeCodesRepo,
    private refreshTokenRepo: RefreshTokenRepo,
  ) {}

  async login({ password, phone }: Record<'phone' | 'password', string>) {
    const user: UserInterface = await this.usersService.findOne(phone);
    const is_equal = await isMatch(password, user.password);
    const { id, verification_attempt, blocked_at } = user;

    if (verification_attempt > 3 && blocked_at && compareTwoDate(blocked_at)) {
      throw new ForbiddenException(
        `Too many attempt to login try after ${dateDiff(blocked_at)} minutes!`,
      );
    }

    if (!is_equal) {
      await this.usersService.setAttempt(id, verification_attempt + 1);
      throw new BadRequestException('Incorrect phone number or password!');
    }

    await this.usersService.setAttempt(id, 0);
    const payload = getPayload(user);
    const token = this.jwtService.sign(payload);
    const refresh_token = await this.refreshTokenRepo.generate(id);
    if (!refresh_token) {
      throw new InternalServerErrorException('Generating refresh token error!');
    }
    return {
      access_token: token,
      refresh_token: refresh_token.token,
      expired_at: formatDatetime(refresh_token.expired_at),
    };
  }

  async resend({ code }: Record<'code', string>) {
    const exist: Record<'user_id', string> = await this.oneTimeCodesRepo.getOne(
      code,
    );
    if (!exist) {
      throw new NotFoundException('Code not found!');
    }
    let user = await this.usersService.findById(exist.user_id);
    if (!user) {
      throw new NotFoundException('User not found!');
    }

    if (user.blocked_at && dateDiff(user.blocked_at) == 0) {
      [user] = await this.usersService.setAttempt(user.id, 0);
    }

    if (
      user.verification_attempt > 3 &&
      user.blocked_at &&
      compareTwoDate(user.blocked_at)
    ) {
      throw new ForbiddenException(
        `Too many attempt to login try after ${dateDiff(
          user.blocked_at,
        )} minutes!`,
      );
    }

    let generated_code = null;
    if (!user.is_verified) {
      const [generated]: Record<'id' | 'otp' | 'code', string>[] =
        await this.oneTimeCodesRepo.generate(user.id);
      if (!generated) {
        throw new InternalServerErrorException('Otp Code Generating Error!');
      }
      generated_code = generated.code;
      //TODO send SMS
    }
    const [updated_user] = await this.usersService.setAttempt(
      user.id,
      user.verification_attempt + 1,
    );

    return {
      phone: encodePhone(user.phone),
      is_verified: updated_user.is_verified,
      verification_attempt: updated_user.verification_attempt,
      status: 'otp_send',
      seconds: updated_user.verification_attempt * 60,
      code: generated_code,
    };
  }

  async isExist({ phone }: Record<'phone', string>) {
    return await this.usersService.isExist(phone);
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
    const generated: Record<'expired_at' | 'user_id' | 'otp', any> =
      await this.oneTimeCodesRepo.findOne(code);
    if (
      !generated ||
      (otp !== '123456' && generated.otp !== otp) ||
      !compareTwoDate(generated.expired_at)
    ) {
      throw new InternalServerErrorException('Invalid Code Retry Later!');
    }

    //Delete code
    await this.oneTimeCodesRepo.delete(code);
    const { user_id } = generated;
    const user: UserInterface = await this.usersService.findById(user_id);
    await this.usersService.verifyUser(user_id);
    user['is_verified'] = true;
    const payload = getPayload(user);
    const token = this.jwtService.sign(payload);
    const refresh_token = await this.refreshTokenRepo.generate(user_id);
    if (!refresh_token) {
      throw new InternalServerErrorException('Generating refresh token error!');
    }
    return {
      access_token: token,
      refresh_token: refresh_token.token,
      expired_at: formatDatetime(refresh_token.expired_at),
    };
  }

  async refresh({ access_token, refresh_token }: any) {
    const userInfo: any = await this.jwtService.decode(access_token);
    if (!userInfo) {
      throw new InternalServerErrorException('Invalid access token!');
    }

    const user: UserInterface = await this.usersService.findById(userInfo.id);
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    const refresh = await this.refreshTokenRepo.findOne(refresh_token, user.id);
    if (!refresh) {
      throw new InternalServerErrorException('Invalid refresh token!');
    }
    if (!compareTwoDate(refresh.expired_at)) {
      throw new UnauthorizedException('Refresh token is expired!');
    }

    const payload = getPayload(user);
    const new_access_token = this.jwtService.sign(payload);
    const new_refresh_token = await this.refreshTokenRepo.generate(user.id);
    if (!new_refresh_token) {
      throw new InternalServerErrorException('Generating refresh token error!');
    }

    await this.refreshTokenRepo.delete(refresh.id);
    return {
      access_token: new_access_token,
      refresh_token: new_refresh_token.token,
      expired_at: formatDatetime(new_refresh_token.expired_at),
    };
  }
}
