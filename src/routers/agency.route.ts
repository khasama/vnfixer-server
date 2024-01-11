import { agencyController } from "../controllers/agency.controller";
import {
  agencyPaymentValidate,
  agencyValidate,
  filterAgenciesValidate,
} from "../middlewares/validate";
import { verifyUser } from "../middlewares/verify";
import { BaseRouter } from "./base.router";

class AgencyRouter extends BaseRouter {
  private _controller = agencyController;

  constructor() {
    super();
    this.init();
  }
  protected init() {
    this.router.get("/", filterAgenciesValidate, this._controller.getAll);
    this.router.get(
      "/payment/:id",
      verifyUser(),
      this._controller.getPaymentInfo
    );
    this.router.post(
      "/payment/:id",
      verifyUser(),
      agencyPaymentValidate,
      this._controller.agencyPayment
    );
    this.router.get("/:id", this._controller.getOne);
    this.router.post(
      "/",
      verifyUser(),
      agencyValidate,
      this._controller.create
    );
    this.router.put("/:id", agencyValidate, this._controller.update);
  }
}

export const agencyRouter = new AgencyRouter().router;
