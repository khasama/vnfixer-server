import { branchController } from "../controllers/branch.controller";
import { branchValidate } from "../middlewares/validate";
import { BaseRouter } from "./base.router";

class BranchRouter extends BaseRouter {
  private _controller = branchController;

  constructor() {
    super();
    this.init();
  }
  protected init() {
    this.router.get("/:id", this._controller.getOne);
    this.router.post("/", branchValidate, this._controller.create);
    this.router.put("/:id", branchValidate, this._controller.update);
  }
}

export const branchRouter = new BranchRouter().router;
