import BaseApiService from './baseApiService.js';

export class ExamOrderService extends BaseApiService {
    async finishAppointment(examOrderId) {
        return this.httpClient.post(`${this.microservice}/${this.endpoint}/finish-appointment/${examOrderId}`);
    }

    async updateMinioFile(examOrderId, minioId) {
        return this.httpClient.post(`${this.microservice}/${this.endpoint}/update-minio-file/${examOrderId}/${minioId}`);
    }
}

export default ExamOrderService;