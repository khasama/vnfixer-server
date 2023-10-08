import { IUser } from "../../constants/";
/**
 * @description ITestServiceInterface.
 */
export interface IUserService {
  getAll(): Promise<IUser[]>;
}
