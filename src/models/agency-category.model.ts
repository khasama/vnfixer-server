import { DataTypes, Model } from "sequelize";
import { sequelize } from "../configs/sequelize.config";
import { IAgencyCategory } from "../constants";
import { Agency } from "./agencies.model";
import { Category } from "./categories.model";

export class AgencyCategory extends Model implements IAgencyCategory {
  agencyId: number;
  categoryId: number;
}

AgencyCategory.init(
  {
    agencyId: {
      type: DataTypes.INTEGER,
      references: {
        model: Agency,
        key: "id",
      },
    },
    categoryId: {
      type: DataTypes.INTEGER,
      references: {
        model: Category,
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "AgencyCategory",
    tableName: "tb_agency_category",
  }
);
