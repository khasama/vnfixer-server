import { Sequelize, DataTypes, Model } from "sequelize";
import { sequelize } from "../configs/sequelize.config";
import { AgencyRoleType, IUser, RoleType } from "../constants";

export class User extends Model implements IUser {
  id: number;
  email: string;
  password: string;
  phone: string;
  address: string;
  fullName: string;
  imageUrl: string;
  active: boolean;
  role: RoleType;
  branchId: number | null;
  agencyRole: AgencyRoleType | null;
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
    imageUrl: {
      type: DataTypes.STRING,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    role: {
      type: DataTypes.ENUM({ values: Object.values(RoleType) }),
      defaultValue: RoleType.CUSTOMER,
    },
    branchId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    agencyRole: {
      type: DataTypes.ENUM({ values: Object.values(AgencyRoleType) }),
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "tb_user",
  }
);
