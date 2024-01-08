import { DataTypes, Model } from "sequelize";
import { sequelize } from "../configs/sequelize.config";
import { IBranch, cities } from "../constants";

export class Branch extends Model implements IBranch {
  id: number;
  city: string;
  district: string;
  address: string;
  agencyId: number;
}

Branch.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    city: {
      type: DataTypes.ENUM({ values: cities }),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    district: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    agencyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Branch",
    tableName: "tb_branch",
  }
);
