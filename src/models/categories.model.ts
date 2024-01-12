import { DataTypes, Model } from "sequelize";
import { sequelize } from "../configs/sequelize.config";
import { ICategory } from "../constants";

export class Category extends Model implements ICategory {
  id: number;
  name: string;
  key: string;
  description?: string;
}

Category.init(
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
    key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT("medium"),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Category",
    tableName: "tb_category",
  }
);
