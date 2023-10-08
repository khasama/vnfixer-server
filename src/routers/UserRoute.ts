import { userController } from "../controllers/UserController";
import { BaseRouter } from "./BaseRouter";

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
