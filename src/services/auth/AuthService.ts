import bcrypt from "bcrypt";
import { IAuth } from "../../constants";
import { LoginDto } from "../../dtos/auth/login.dto";
import { User } from "../../models/Users";
import { IAuthService } from "./IAuthService";
import { RegisterDto } from "../../dtos/auth/register.dto";
import { genAccessToken } from "../../utils/jwt";
import { plainToClass } from "class-transformer";
import { UserDto } from "../../dtos/user/user.dto";

/**
 * @description AuthServive.
 */
class AuthServive implements IAuthService {
  private userModel = User;

  async login({ email, password }: LoginDto): Promise<IAuth> {
    const user = await this.userModel.findOne({ where: { email }, raw: true });
    if (!user) {
      throw new Error("Email not found");
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new Error("Wrong password");
    }
    const accessToken = await genAccessToken(plainToClass(UserDto, user));

    return { accessToken } as IAuth;
  }

  async register({ email, password }: RegisterDto) {
    const user = await this.userModel.findOne({ where: { email }, raw: true });
    if (user) {
      throw new Error("Email is exist");
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
