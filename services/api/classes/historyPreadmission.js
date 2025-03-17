import BaseApiService from "./baseApiService.js";

export class HistoryPreadmissionService extends BaseApiService {
  async createHistoryPreadmission(data, patientId) {
    return await this.httpClient.post(
      `${this.microservice}/${this.endpoint}/${patientId}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  async getHistoryPreadmissionByPatient(patientId) {
    return await this.httpClient.get(
      `${this.microservice}/${this.endpoint}/last-history/${patientId}`
    );
  }
}

export default HistoryPreadmissionService;
