import { IsEmail, IsString, MinLength } from "class-validator";

export class LoginDto {
  @IsEmail({}, { message: "Provided Email is not valid" })
  email: string;

  @IsString()
  @MinLength(8, { message: "Password should be minimum of 8 characters" })
  password: string;
}
