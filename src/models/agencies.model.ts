import { DataTypes, Model } from "sequelize";
import { sequelize } from "../configs/sequelize.config";
import { IAgency } from "../constants";
import { Category } from "./categories.model";

export class Agency extends Model implements IAgency {
  id: number;
  name: string;
  description: string;
  logo: string;
  categoryId: number;
}

Agency.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    logo: {
      type: DataTypes.STRING,
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
    modelName: "Agency",
    tableName: "tb_agency",
  }
);
