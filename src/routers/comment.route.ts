import { commentController } from "../controllers/comment.controller";
import { verifyUser } from "../middlewares/verify";
import { BaseRouter } from "./base.router";

class CommentRouter extends BaseRouter {
  private _controller = commentController;

  constructor() {
    super();
    this.init();
  }
  protected init() {
    this.router.post("/", verifyUser(), this._controller.create);
    this.router.delete("/:id", verifyUser(), this._controller.delete);
    this.router.get("/agency/:id", this._controller.getCommentsOfAgency);
  }
}

export const commentRouter = new CommentRouter().router;
