import cors from "cors";
import fileUpload from "express-fileupload";
import express from "express";
import { BaseRouter } from "./BaseRouter";
import { healthCheckRouter } from "./HealthCheckRouter";
import { userRouter } from "./UserRoute";

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
  }
}

export const masterRoute = new MasterRouter().router;
