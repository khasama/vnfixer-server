import { userController } from "../controllers/user.controller";
import { BaseRouter } from "./base.router";

class UserRouter extends BaseRouter {
  private _controller = userController;

  constructor() {
    super();
    this.init();
  }
  protected init() {
    this.router.get("/", this._controller.getAll);
  }
}

export const userRouter = new UserRouter().router;
