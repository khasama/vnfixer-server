import { authController } from "../controllers/auth.controller";
import { authValidate } from "../middlewares/validate";
import { verifyUser } from "../middlewares/verify";
import { BaseRouter } from "./base.router";

class AuthRouter extends BaseRouter {
  private _controller = authController;

  constructor() {
    super();
    this.init();
  }
  protected init() {
    this.router.post("/login", authValidate, this._controller.login);
    this.router.post("/register", authValidate, this._controller.register);
    this.router.post("/logout", verifyUser(), this._controller.logout);
  }
}

export const authRouter = new AuthRouter().router;
