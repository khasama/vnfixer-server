import { IUser } from "../constants";
import { User } from "../models";

interface IUserService {
  getAll(): Promise<IUser[]>;
}

class UserServive implements IUserService {
  private userModel = User;

  async getAll(): Promise<IUser[]> {
    const users = await this.userModel.findAll();
    return users;
  }
}

export const userService = new UserServive();
