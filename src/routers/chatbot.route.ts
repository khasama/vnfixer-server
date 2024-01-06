import { chatbotController } from "../controllers/chatbot.controller";
import { chatbotValidate } from "../middlewares/validate";
import { verifyUser } from "../middlewares/verify";
import { BaseRouter } from "./base.router";

class ChatbotRouter extends BaseRouter {
  private _controller = chatbotController;

  constructor() {
    super();
    this.init();
  }
  protected init() {
    this.router.post(
      "/ask",
      verifyUser(),
      chatbotValidate,
      this._controller.ask
    );
  }
}

export const chatbotRouter = new ChatbotRouter().router;
