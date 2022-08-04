import { IsEmail, Length, MinLength } from 'class-validator';
import { UserEntity } from '../entities/user.entity';

export class CreateUserDto {
  @IsEmail(undefined, { message: 'Неверная почта' })
  email: string;

  @Length(3, 32, { message: 'Пароль должен быть минимум 3 символа' })
  password: string;
}
