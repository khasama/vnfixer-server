import { IAgency, ICategory } from "../../constants";

export class AgencyDto implements IAgency {
  id?: number;
  logo: string;
  name: string;
  description?: string;
  categoryId: number;
}
