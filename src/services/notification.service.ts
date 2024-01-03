import { INotificationContent } from "../constants";
import { Notification, User } from "../models";
import { sendNotificationMobile } from "../utils/sendNotification";

interface INotificationService {}

class NotificationService implements INotificationService {
  private userModel = User;
  private notificationModel = Notification;

  async send(userId: number, content: INotificationContent) {
    const user = await this.userModel.findOne({
      where: {
        id: userId,
      },
    });
    await this.create(userId, content);
    sendNotificationMobile(user.mobileNotiToken, content);
  }

  async create(userId: number, content: INotificationContent) {
    const notification = await this.notificationModel.create({
      content,
      ownerId: userId,
    });
    return notification;
  }

  async delete(userId: number, notificationId: number) {
    const notification = await this.notificationModel.findOne({
      where: {
        id: notificationId,
        ownerId: userId,
      },
    });
    await notification.destroy({ force: true });
  }

  async makeRead(userId: number, notificationId: number) {
    await this.notificationModel.update(
      {
        read: true,
      },
      {
        where: {
          id: notificationId,
          ownerId: userId,
        },
      }
    );
  }

  async getMyNotifications(userId: number) {
    const notifications = await this.notificationModel.findAll({
      where: {
        ownerId: userId,
      },
      order: [["id", "DESC"]],
      include: [
        {
          model: User,
          as: "owner",
          attributes: ["id", "email"],
        },
      ],
    });
    return notifications;
  }
}

export const notificationService = new NotificationService();
