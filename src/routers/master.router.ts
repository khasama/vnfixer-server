import cors from "cors";
import fileUpload from "express-fileupload";
import express from "express";
import { BaseRouter } from "./base.router";
import { healthCheckRouter } from "./health-check.router";
import { userRouter } from "./user.route";
import { authRouter } from "./auth.route";
import { errorController } from "../controllers/error.controller";
import { categoryRouter } from "./category.route";
import { agencyRouter } from "./agency.route";
import { branchRouter } from "./branch.route";
import { requestRouter } from "./request.route";

class MasterRouter extends BaseRouter {
  constructor() {
    super();
    this.configure();
    this.init();
  }

  private configure() {
    // define onfigurations
    this.router.use(
      cors({
        origin: "*",
        credentials: true,
      })
    );

    this.router.use(express.json());
    this.router.use(express.urlencoded({ extended: true }));
    this.router.use(
      fileUpload({
        limits: { fileSize: 5 * 1024 * 1024 },
      })
    );
  }

  /**
   * Connect routes to their matching routers.
   */
  protected init() {
    this.router.use("/health-check", healthCheckRouter);
    this.router.use("/users", userRouter);
    this.router.use("/auth", authRouter);
    this.router.use("/categories", categoryRouter);
    this.router.use("/agencies", agencyRouter);
    this.router.use("/branches", branchRouter);
    this.router.use("/requests", requestRouter);

    this.router.use(errorController.error);
  }
}

export const masterRoute = new MasterRouter().router;
