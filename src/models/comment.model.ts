import { DataTypes, Model } from "sequelize";
import { sequelize } from "../configs/sequelize.config";
import { IComment } from "../constants";

export class Comment extends Model implements IComment {
  id?: number;
  agencyId: number;
  userId: number;
  comment: string;
}

Comment.init(
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
    comment: {
      type: DataTypes.TEXT("medium"),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Comment",
    tableName: "tb_comment",
  }
);
