import { IBranch } from "../../constants";

export class BranchDto implements IBranch {
  id?: number;
  city: string;
  district: string;
  address: string;
  agencyId: number;
}
