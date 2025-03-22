import BaseApiService from "./baseApiService.js";

export class BillingService extends BaseApiService {
  async getBillingReport(data) {
    return await this.httpClient.post(
      `medical/admissions/billing/report`,
      data
    );
  }
}

export default BillingService;
