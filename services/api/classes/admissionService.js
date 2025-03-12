import BaseApiService from './baseApiService.js';

export class AdmissionService extends BaseApiService {

    async createAdmission(data, patientId) {
        return await this.httpClient.get(`${this.microservice}/${this.endpoint}/${patientId}/create`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    async getAdmisionsAll() {
        return await this.httpClient.get(`${this.microservice}/${this.endpoint}-all`)
    }

    async getAdmissionById(id) {
        return await this.httpClient.get(`${this.microservice}/${this.endpoint}/${id}`);
    }
}

export default AdmissionService;
