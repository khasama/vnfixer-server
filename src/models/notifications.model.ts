import { DataTypes, Model } from "sequelize";
import { sequelize } from "../configs/sequelize.config";
import { INotification, INotificationContent } from "../constants";

export class Notification extends Model implements INotification {
  id?: number;
  content: string;
  read: boolean;
  ownerId: number;
}

Notification.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
      get: function () {
        return JSON.parse(this.getDataValue("content"));
      },
      set: function (value: INotificationContent) {
        return this.setDataValue("content", JSON.stringify(value));
      },
    },
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Notification",
    tableName: "tb_notification",
  }
);
