import { DataTypes, Model } from "sequelize";
import { sequelize } from "../configs/sequelize.config";
import { IRequest, RequestStatus, cities } from "../constants";

export class Request extends Model implements IRequest {
  id: number;
  description: string;
  city: string;
  district: string;
  location: string;
  expectDate: string;
  status: string;
  categoryId: number;
  branchId: number | null;
  customerPhone: string;
  customerName: string;
  customerEmail: string;
  userId: number;
  staffId: number | null;
  pickerId: number | null;
}

Request.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    description: {
      type: DataTypes.STRING,
    },
    city: {
      type: DataTypes.ENUM({ values: cities }),
      allowNull: false,
    },
    district: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expectDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM({ values: Object.values(RequestStatus) }),
      defaultValue: RequestStatus.PENDING,
    },
    customerPhone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customerEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    branchId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    staffId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    pickerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Request",
    tableName: "tb_request",
  }
);
