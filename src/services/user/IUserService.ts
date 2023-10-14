import { IUser } from "../../constants/";

export interface IUserService {
  getAll(): Promise<IUser[]>;
}
