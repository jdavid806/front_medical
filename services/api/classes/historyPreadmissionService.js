import BaseApiService from "./baseApiService.js";

export class HistoryPreadmissionService extends BaseApiService {
  async createHistoryPreadmission(data) {
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

  async getLastHistoryPatient(patientId) {
    return await this.httpClient.get(
      `${this.microservice}/${this.endpoint}/last-history/${patientId}`
    );
  }
}

export default HistoryPreadmissionService;
