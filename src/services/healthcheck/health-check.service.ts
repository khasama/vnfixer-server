import { IHealthCheckService } from "./IHealthCheckService";

class HealthCheckServive implements IHealthCheckService {
  default() {
    return { data: "khapro" };
  }
}

export const healthCheckService = new HealthCheckServive();
