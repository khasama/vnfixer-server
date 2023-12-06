import { DataTypes, Model } from "sequelize";
import { sequelize } from "../configs/sequelize.config";
import {
  AgencyRoleType,
  IStaffRequest,
  StaffRequestStatus,
} from "../constants";

export class StaffRequest extends Model implements IStaffRequest {
  id: number;
  branchId: number;
  userId: number;
  status: StaffRequestStatus;
  role: AgencyRoleType;
}

StaffRequest.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    branchId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM({ values: Object.values(StaffRequestStatus) }),
      defaultValue: StaffRequestStatus.PENDING,
    },
    role: {
      type: DataTypes.ENUM({ values: Object.values(AgencyRoleType) }),
    },
  },
  {
    sequelize,
    modelName: "StaffRequest",
    tableName: "tb_staff_request",
  }
);
