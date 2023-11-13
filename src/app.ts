import { Server } from "./server";
// import mongoose from "mongoose";
import * as swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "./utils/swagger.json";
import dotenv from "dotenv";

/**
 * Application class.
 * @description Handle init config and components.
 */
dotenv.config({
  path: ".env",
});

export class Application {
  server: Server;

  init() {
    this.initServer();
    this.connectDB();
  }

  private initServer() {
    this.server = new Server();
  }

  private connectDB() {}

  start() {
    ((port = process.env.APP_PORT || 5000) => {
      this.server.app.use(
        "/api-docs",
        swaggerUi.serve,
        swaggerUi.setup(swaggerDocument)
      );
      this.server.app.use("/api", this.server.router);
      this.server.app.listen(port, () => {
        console.log(`Listening on port ${port}`);
      });
    })();
  }
}
