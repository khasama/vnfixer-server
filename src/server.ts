import express from "express";
import { masterRoute } from "./routers/MasterRouter";
/**
 * Express server application class.
 * @description Will later contain the routing system.
 */
export class Server {
  public app = express();
  public router = masterRoute;
}
