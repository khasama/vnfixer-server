import { BaseRouter } from "./base.router";
import { healthCheckController } from "../controllers/health-check.controller";

/**
 * @description HealthCheckRouter.
 */
class HealthCheckRouter extends BaseRouter {
  private _controller = healthCheckController;

  constructor() {
    super();
    this.init();
  }

  /**
   * Connect routes to their matching controller endpoints.
   */
  protected init() {
    this.router.get("/", this._controller.default);
  }
}

export const healthCheckRouter = new HealthCheckRouter().router;
