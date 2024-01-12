import { DataTypes, Model } from "sequelize";
import { sequelize } from "../configs/sequelize.config";
import { IPaymentInformation } from "../constants";

export class Payment extends Model implements IPaymentInformation {
  id?: number;
  userId: number;
  agencyId: number;
  total: number;
}

Payment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    total: {
      type: DataTypes.INTEGER,
    },
    userId: {
      type: DataTypes.INTEGER,
    },
    agencyId: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    modelName: "Payment",
    tableName: "tb_payment",
  }
);
