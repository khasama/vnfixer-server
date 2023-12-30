import { Request, Response } from "express";
import { notificationService } from "../services/notification.service";
import { catchAsync } from "../utils/catch-async";
import { User } from "../models";
import { BaseRespone } from "../utils/base-respone";
import { HttpError } from "../constants";

class NotificationController {
  private _service = notificationService;

  getMyNotifications = catchAsync(async (req: Request, res: Response) => {
    const user: User = req["user"];
    const result = await this._service.getMyNotifications(user.id);
    const respone = new BaseRespone("success", HttpError.SUCCESS, result);
    return res.status(200).json(respone);
  });
}

export const notificationController = new NotificationController();
