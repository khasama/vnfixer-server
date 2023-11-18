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
    this.router.get("/", this._controller.getAll);
    this.router.get("/:id", this._controller.getOne);
    this.router.patch("/:id", this._controller.changeStatus);
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
