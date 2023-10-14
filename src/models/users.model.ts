import { Sequelize, DataTypes, Model } from "sequelize";
import { sequelize } from "../configs/sequelize.config";
import { IUser, RoleType } from "../constants";

export class User extends Model implements IUser {
  id: number;
  email: string;
  password: string;
  phone: string;
  address: string;
  fullName: string;
  role: RoleType;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    fullName: {
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
