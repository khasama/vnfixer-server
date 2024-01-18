import { paymentController } from "../controllers/payment.controller";
import { verifyUser } from "../middlewares/verify";
import { BaseRouter } from "./base.router";

class PaymentRouter extends BaseRouter {
  private _controller = paymentController;

  constructor() {
    super();
    this.init();
  }
  protected init() {
    this.router.get(
      "/vnpay_return/:id",
      verifyUser(),
      this._controller.checkPaymentResult
    );
  }
}

export const paymentRouter = new PaymentRouter().router;
