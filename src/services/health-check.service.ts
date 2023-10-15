interface IHealthCheckService {
  default();
}

class HealthCheckServive implements IHealthCheckService {
  async default() {
    return { data: "khapro" };
  }
}

export const healthCheckService = new HealthCheckServive();
