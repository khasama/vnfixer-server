import { userController } from "../controllers/user.controller";
import { verifyUser } from "../middlewares/verify";
import { BaseRouter } from "./base.router";

class UserRouter extends BaseRouter {
  private _controller = userController;

  constructor() {
    super();
    this.init();
  }
  protected init() {
    this.router.get("/", this._controller.getAll);
    this.router.put(
      "/staff-request",
      verifyUser(),
      this._controller.staffRequest
    );
    this.router.get(
      "/staff-request",
      verifyUser(),
      this._controller.allStaffRequest
    );
  }
}

export const userRouter = new UserRouter().router;
