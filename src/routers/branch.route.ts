import { AgencyRoleType } from "../constants";
import { branchController } from "../controllers/branch.controller";
import { addStaffValidate, branchValidate } from "../middlewares/validate";
import { verifyAgencyRole, verifyUser } from "../middlewares/verify";
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
    this.router.post(
      "/add-staff",
      verifyAgencyRole(AgencyRoleType.MANAGER),
      addStaffValidate,
      this._controller.addStaff
    );
  }
}

export const branchRouter = new BranchRouter().router;
