import { IRequest } from "../../constants";

export class RequestDto implements IRequest {
  id?: number;
  description: string;
  city: string;
  district: string;
  location: string;
  expectDate: string | string[];
  status: string;
  categoryId: number;
  branchId: number;
  customerPhone: string;
  customerName: string;
  customerEmail: string;
  userId: number;
  staffId: number;
  pickerId: number;
}
