export enum RoleType {
  ADMIN = "ADMIN",
  CUSTOMER = "CUSTOMER",
  AGENCY = "AGENCY",
}

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  role: RoleType;
}
