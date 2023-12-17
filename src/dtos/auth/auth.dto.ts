import { UserDto } from "../user/user.dto";

export class AuthDto {
  user: UserDto;
  accessToken: string;
}
