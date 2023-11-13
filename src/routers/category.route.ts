import { categoryController } from "../controllers/category.controller";
import { categoryValidate } from "../middlewares/validate";
import { BaseRouter } from "./base.router";

class CategoryRouter extends BaseRouter {
  private _controller = categoryController;

  constructor() {
    super();
    this.init();
  }
  protected init() {
    this.router.get("/", this._controller.getAll);
    this.router.get("/:id", this._controller.getOne);
    this.router.post("/", categoryValidate, this._controller.create);
    this.router.put("/:id", categoryValidate, this._controller.update);
  }
}

export const categoryRouter = new CategoryRouter().router;
