import { DataTypes, Model } from "sequelize";
import { sequelize } from "../configs/sequelize.config";
import { IRequest, RequestStatus, cities } from "../constants";

export class Request extends Model implements IRequest {
  id: number;
  title: string;
  description: string;
  city: string;
  location: string;
  expectDate: Date;
  status: string;
  categoryId: number;
  branchId: number | null;
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
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM({ values: Object.values(RequestStatus) }),
      defaultValue: RequestStatus.PENDING,
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
