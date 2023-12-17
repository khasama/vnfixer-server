import bcrypt from "bcrypt";
import { IAuth } from "../constants";
import { LoginDto } from "../dtos/auth/login.dto";
import { RegisterDto } from "../dtos/auth/register.dto";
import { genAccessToken } from "../utils/jwt";
import { plainToClass } from "class-transformer";
import { UserDto } from "../dtos/user/user.dto";
import createError from "http-errors";
import { User } from "../models";
import { AuthDto } from "../dtos/auth/auth.dto";

interface IAuthService {
  login(body: LoginDto): Promise<AuthDto>;
  register(body: RegisterDto): Promise<{ message: string }>;
  logout();
}

class AuthServive implements IAuthService {
  private userModel = User;

  async login({ email, password }: LoginDto): Promise<AuthDto> {
    const user = await this.userModel.findOne({ where: { email }, raw: true });
    if (!user) {
      throw createError.BadRequest("Email not found");
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw createError.BadRequest("Wrong password");
    }
    const accessToken = await genAccessToken(plainToClass(UserDto, user));

    return { accessToken, user: plainToClass(UserDto, user) } as AuthDto;
  }

  async register({
    email,
    password,
  }: RegisterDto): Promise<{ message: string }> {
    const user = await this.userModel.findOne({ where: { email }, raw: true });
    if (user) {
      throw createError.BadRequest("Email is exist");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    await this.userModel.create({
      email,
      password: hashPassword,
    });
    return {
      message: "Register success",
    };
  }

  async logout() {
    throw new Error("Method not implemented.");
  }
}

export const authService = new AuthServive();
