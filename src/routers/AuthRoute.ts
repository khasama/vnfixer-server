import { authController } from "../controllers/auth.controller";
import { BaseRouter } from "./BaseRouter";

class AuthRouter extends BaseRouter {
  private _controller = authController;

  constructor() {
    super();
    this.init();
  }
  protected init() {
    this.router.post("/login", this._controller.login);
    this.router.post("/logout", this._controller.logout);
    this.router.post("/register", this._controller.register);
  }
}

export const authRouter = new AuthRouter().router;
