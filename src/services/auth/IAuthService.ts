import { IAuth, IUser } from "../../constants/";
import { LoginDto } from "../../dtos/auth/login.dto";
import { RegisterDto } from "../../dtos/auth/register.dto";
/**
 * @description ITestServiceInterface.
 */
export interface IAuthService {
  login(body: LoginDto): Promise<IAuth>;
  register(body: RegisterDto);
  logout();
}
