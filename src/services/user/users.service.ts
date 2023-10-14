import { IUser } from "../../constants";
import { User } from "../../models/users.model";
import { IUserService } from "./IUserService";

class UserServive implements IUserService {
  private userModel = User;

  async getAll(): Promise<IUser[]> {
    const users = await this.userModel.findAll();
    return users;
  }
}

export const userService = new UserServive();
