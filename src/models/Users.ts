import { Sequelize, DataTypes, Model } from "sequelize";
import { sequelize } from "../configs/sequelize.config";
import { IUser, RoleType } from "../constants";

export class User extends Model implements IUser {
  id: number;
  firstName: string;
  lastName: string;
  role: RoleType;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.ENUM({ values: Object.values(RoleType) }),
      defaultValue: RoleType.CUSTOMER,
    },
  },
  {
    sequelize,
    underscored: true,
    modelName: "User",
    tableName: "tb_user",
  }
);
