import {
  IsDefined,
  IsNotEmpty,
  IsNumberString,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserInterface } from '../../users/interfaces/user.interface';

export class RegisterDto implements UserInterface {
  @IsDefined()
  @IsNumberString()
  @IsNotEmpty()
  @MinLength(12)
  @MaxLength(12)
  phone: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  surname: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  password: string;
}

export class IsExistDto {
  @IsDefined()
  @IsNumberString()
  @IsNotEmpty()
  @MinLength(12)
  @MaxLength(12)
  phone: string;
}

export class VerifyOtp {
  @IsDefined()
  @IsNumberString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(6)
  otp: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MinLength(60)
  @MaxLength(64)
  code: string;
}

export class LoginDto {
  @IsDefined()
  @IsNumberString()
  @IsNotEmpty()
  @MinLength(12)
  @MaxLength(12)
  phone: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  password: string;
}

export class ResendDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MinLength(60)
  @MaxLength(64)
  code: string;
}

export class RefreshDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MinLength(60)
  access_token: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MinLength(60)
  @MaxLength(64)
  refresh_token: string;
}
