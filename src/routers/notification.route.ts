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
    this.router.patch(
      "/make-read/:id",
      verifyUser(),
      this._controller.makeRead
    );
    this.router.delete("/:id", verifyUser(), this._controller.delete);
  }
}

export const notificationRouter = new NotificationRouter().router;
