import { IUser, RoleType } from "../../constants";
import { Exclude } from "class-transformer";

export class UserDto implements IUser {
  id: number;

  email: string;

  @Exclude({ toPlainOnly: false })
  password: string;

  phone?: string;

  address?: string;

  fullName?: string;

  role: RoleType;
}
