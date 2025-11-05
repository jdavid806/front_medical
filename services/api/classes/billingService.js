import BaseApiService from "./baseApiService.js";

export class BillingService extends BaseApiService {
  async getBillingReport(data) {
    return await this.httpClient.post(
      `medical/admissions/billing/report`,
      data
    );
  }

  async getBillingReportByEntity(data) {
    return await this.httpClient.post(
      `medical/admissions/billing/report/by-entity`,
      data
    );
  }

  async getBillingReportByEntityDetailed() {
    return await this.httpClient.get(
      `medical/admissions/billing/report/by-entity/detailed`
    );
  }

  async getBillingByType(type) {
    return await this.httpClient.get(
      `medical/companies/1/billings/by-type/${type}`
    );
  }

  async getBillings() {
    const dataEmpresa = await this.httpClient.get(`medical/companies?include=billings`);
    return dataEmpresa.data[0].includes.billings;
  }

  async storeByEntity(data) {
    return await this.httpClient.post(
      `medical/admissions/billing/store-by-entity`,
      data
    );
  }

  async getCashFlowReport(data) {
    return await this.httpClient.post(
      `medical/admissions/cash-flow/report`,
      data
    );
  }

  async productivityByDoctor(data) {
    return await this.httpClient.post(
      `medical/admissions/billing/report/productivity`,
      data
    );
  }
  async saveBillingConfiguration(payload) {
    return await this.httpClient.post(
      `medical/companies/1/billings`,
      payload
    );
  }

  async updateBillingConfiguration(payload, id) {
    return await this.httpClient.put(
      `medical/companies/1/billings/${id}`,
      payload
    );
  }
}

export default BillingService;
