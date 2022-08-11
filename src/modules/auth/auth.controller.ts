import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { IsExistDto, LoginDto, RegisterDto, VerifyOtp } from './dto/index.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @Post('/is-exist')
  isExist(@Body() payload: IsExistDto) {
    return this.authService.isExist(payload);
  }

  @Post('/register')
  register(@Body() payload: RegisterDto) {
    return this.authService.register(payload);
  }

  @Post('/verify')
  verify(@Body() payload: VerifyOtp) {
    return this.authService.verify(payload);
  }

  @Post('/login')
  login(@Body() payload: LoginDto) {
    return this.authService.login(payload);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getProfile(@Req() req) {
    return req.user;
  }
}
