import { seedController } from "../controllers/seed.controller";
import { BaseRouter } from "./base.router";

class SeedRouter extends BaseRouter {
  private _controller = seedController;

  constructor() {
    super();
    this.init();
  }
  protected init() {
    this.router.post("/", this._controller.seed);
  }
}

export const seedRouter = new SeedRouter().router;
