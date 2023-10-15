export enum RoleType {
  ADMIN = "ADMIN",
  CUSTOMER = "CUSTOMER",
  AGENCY = "AGENCY",
}

export interface IAuth {
  accessToken: string;
}

export interface IUser {
  id: number;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  fullName?: string;
  role: RoleType;
}
