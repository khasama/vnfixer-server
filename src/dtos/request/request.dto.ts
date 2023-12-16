import { IRequest } from "../../constants";

export class RequestDto implements IRequest {
  id?: number;
  title: string;
  description: string;
  city: string;
  location: string;
  expectDate: string | string[];
  status: string;
  categoryId: number;
  branchId: number;
  customerPhone: string;
  customerName: string;
  customerEmail: string;
  userId: number;
}
