import { IHealthCheckService } from "./IHealthCheckService";

/**
 * @description HealthCheckServive.
 */
class HealthCheckServive implements IHealthCheckService {
  default() {
    return { data: "khapro" };
  }
}

export const healthCheckService = new HealthCheckServive();
