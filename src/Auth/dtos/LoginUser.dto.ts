import { IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  /**
   * Must not be empty
   * @example lisa@example.com""
   */
  @IsNotEmpty()
  email: string;

  /**
   * Must not be empty
   * @example l1sa@C0ri11o"
   */
  @IsNotEmpty()
  password: string;
}
