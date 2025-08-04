import BaseApiService from "./baseApiService.js";

export class ComissionConfigService extends BaseApiService {
  async comissionConfigStore(data) {
    return await this.httpClient.post(
      `${this.microservice}/${this.endpoint}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  async CommissionConfigUpdate(id, data) {
    return await this.httpClient.put(
      `${this.microservice}/${this.endpoint}/${id}`,
      data
    );
  }

  async CommissionConfigDelete(id) {
    return await this.httpClient.delete(
      `${this.microservice}/${this.endpoint}/${id}`
    );
  }

  async comissionConfigGet() {
    return await this.httpClient.get(`${this.microservice}/${this.endpoint}`);
  }

  async comissionConfigGetById(id) {
    return await this.httpClient.get(
      `${this.microservice}/${this.endpoint}/${id}`
    );
  }

  async comissionReportServices(data) {
    return await this.httpClient.post(
      `${this.microservice}/commissions-report/services`,
      data
    );
  }

  async comissionReportByOrders(data) {
    return await this.httpClient.post(
      `${this.microservice}/commissions-report/orders`,
      data
    );
  }
}

export default ComissionConfigService;
