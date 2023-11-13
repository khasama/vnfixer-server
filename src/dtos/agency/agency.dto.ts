import { IAgency, ICategory } from "../../constants";

export class AgencyDto implements IAgency {
  id?: number;
  name: string;
  description?: string;
  categories?: number[];
}
