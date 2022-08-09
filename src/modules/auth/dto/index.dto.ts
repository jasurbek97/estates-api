import { Injectable } from '@nestjs/common';
import {
  IsDefined,
  IsNotEmpty,
  IsNumberString,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserInterface } from '../../users/interfaces/user.interface';

@Injectable()
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