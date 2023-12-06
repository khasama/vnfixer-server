import { IRequest } from "../../constants";

export class RequestDto implements IRequest {
  id?: number;
  title: string;
  description: string;
  city: string;
  location: string;
  expectDate: Date;
  status: string;
  categoryId: number;
  branchId: number;
  userId: number;
}
