import { DataTypes, Model } from "sequelize";
import { sequelize } from "../configs/sequelize.config";
import { IRequest, RequestStatus, cities } from "../constants";

export class Request extends Model implements IRequest {
  id: number;
  title: string;
  description: string;
  city: string;
  location: string;
  expectDate: string;
  status: string;
  categoryId: number;
  branchId: number | null;
  customerPhone: string;
  customerName: string;
  customerEmail: string;
  userId: number;
}

Request.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    city: {
      type: DataTypes.ENUM({ values: cities }),
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
  },
  {
    sequelize,
    modelName: "Request",
    tableName: "tb_request",
  }
);
