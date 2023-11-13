import { DataTypes, Model } from "sequelize";
import { sequelize } from "../configs/sequelize.config";
import { IAgency } from "../constants";

export class Agency extends Model implements IAgency {
  id: number;
  name: string;
  description: string;
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
  },
  {
    sequelize,
    modelName: "Agency",
    tableName: "tb_agency",
  }
);
