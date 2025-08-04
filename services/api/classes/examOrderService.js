import BaseApiService from "./baseApiService.js";

export class ExamOrderService extends BaseApiService {
  async finishAppointment(examOrderId) {
    return this.httpClient.post(
      `${this.microservice}/${this.endpoint}/finish-appointment/${examOrderId}`
    );
  }

  async updateMinioFile(examOrderId, data) {
    return this.httpClient.patch(
      `${this.microservice}/${this.endpoint}/update-minio-file/${examOrderId}`,
      data
    );
  }

  async getLastByPatient(patientId) {
    return this.httpClient.get(
      `${this.microservice}/${this.endpoint}/last-by-patient/${patientId}`
    );
  }
}

export default ExamOrderService;
