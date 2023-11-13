import { ICategory } from "../../constants";

export class CategoryDto implements ICategory {
  id?: number;
  name: string;
  description?: string;
}
