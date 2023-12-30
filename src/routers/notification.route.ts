import { notificationController } from "../controllers/notification.controller";
import { verifyUser } from "../middlewares/verify";
import { BaseRouter } from "./base.router";

class NotificationRouter extends BaseRouter {
  private _controller = notificationController;

  constructor() {
    super();
    this.init();
  }
  protected init() {
    this.router.get("/", verifyUser(), this._controller.getMyNotifications);
  }
}

export const notificationRouter = new NotificationRouter().router;
