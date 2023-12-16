import { DataTypes, Model } from "sequelize";
import { sequelize } from "../configs/sequelize.config";
import { IRating, RatingPoint } from "../constants";

export class Rating extends Model implements IRating {
  id?: number;
  agencyId: number;
  userId: number;
  rating: RatingPoint;
}

Rating.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    agencyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Rating",
    tableName: "tb_rating",
  }
);
