import BaseApiService from "./baseApiService";

export class HistoryRequestIAService extends BaseApiService {
  async createRequestIA(data) {
    return await this.httpClient.post(
      `https://hooks.medicalsoft.ai/webhook/herramientasia`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

export default HistoryRequestIAService;
