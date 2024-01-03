import { userController } from "../controllers/user.controller";
import {
  findWithEmailSchemaValidate,
  updateInfoValidate,
  updateNotiTokenValidate,
} from "../middlewares/validate";
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
    this.router.get(
      "/email",
      verifyUser(),
      findWithEmailSchemaValidate,
      this._controller.findWithEmail
    );
    this.router.put(
      "/information",
      verifyUser(),
      updateInfoValidate,
      this._controller.updateInfo
    );
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
    this.router.patch(
      "/notification-token",
      verifyUser(),
      updateNotiTokenValidate,
      this._controller.updateNotiToken
    );
  }
}

export const userRouter = new UserRouter().router;
