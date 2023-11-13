import { IBranch } from "../../constants";

export class BranchDto implements IBranch {
  id?: number;
  city: string;
  address: string;
  agencyId: number;
}
