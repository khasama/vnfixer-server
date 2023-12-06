import { requestController } from "../controllers/request.controller";
import {
  filterRequestsValidate,
  requestValidate,
} from "../middlewares/validate";
import { verifyUser } from "../middlewares/verify";
import { BaseRouter } from "./base.router";

class RequestRouter extends BaseRouter {
  private _controller = requestController;

  constructor() {
    super();
    this.init();
  }
  protected init() {
    this.router.get("/", filterRequestsValidate, this._controller.getAll);
    this.router.get("/:id", this._controller.getOne);
    this.router.patch("/change-status/:id", this._controller.changeStatus);
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
    this.router.put("/take/:id", verifyUser(), this._controller.takeRequest);
  }
}

export const requestRouter = new RequestRouter().router;
