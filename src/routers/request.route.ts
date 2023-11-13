import { requestController } from "../controllers/request.controller";
import { requestValidate } from "../middlewares/validate";
import { verifyUser } from "../middlewares/verify";
import { BaseRouter } from "./base.router";

class RequestRouter extends BaseRouter {
  private _controller = requestController;

  constructor() {
    super();
    this.init();
  }
  protected init() {
    this.router.get("/:id", this._controller.getOne);
    this.router.post(
      "/",
      verifyUser(),
      requestValidate,
      this._controller.create
    );
    this.router.put(
      "/:id",
      verifyUser(),
      requestValidate,
      this._controller.update
    );
  }
}

export const requestRouter = new RequestRouter().router;
