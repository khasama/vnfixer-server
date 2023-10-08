import { IUser } from "../../constants";
import { User } from "../../models/Users";
import { IUserService } from "./IUserService";

/**
 * @description UserServive.
 */
class UserServive implements IUserService {
  private userModel = User;

  async getAll(): Promise<IUser[]> {
    const users = await this.userModel.findAll();
    return users;
  }
}

export const userService = new UserServive();
