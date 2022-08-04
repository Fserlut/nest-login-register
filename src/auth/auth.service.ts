import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const { password, ...result } = user;
        return result;
      }
      throw new BadRequestException('Неверный логин или пароль');
    }
    return null;
  }

  generateJwtToken(data: { id: string; email: string }) {
    const payload = { email: data.email, sub: data.id };
    return this.jwtService.sign(payload, {
      secret: process.env.PRIVATE_KEY,
    });
  }

  async login(user: UserEntity) {
    const { password, ...userData } = user;
    return {
      ...userData,
      token: this.generateJwtToken(userData),
    };
  }

  async register(creatUserDto: CreateUserDto) {
    try {
      const { password, ...user } = await this.usersService.register(
        creatUserDto,
      );
      return {
        ...user,
        token: this.generateJwtToken(user),
      };
    } catch (e) {
      console.log(e);
      throw new BadRequestException(
        'Пользователь с таким email уже существует',
      );
    }
  }
}
