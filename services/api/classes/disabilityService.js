import BaseApiService from "./baseApiService.js";

export class DisabilityService extends BaseApiService {
    async getAll(id) {
        return await this.httpClient.get(`medical/patients/${id}/disabilities`);
    }

    async getById(id) {
        return await this.httpClient.get(`medical/disabilities/${id}`);
    }

    async create(patientId, data) {
        return await this.httpClient.post(`medical/patients/${patientId}/disabilities`, data);
    }

    async update(disabilityId, data) {
        return await this.httpClient.put(`medical/disabilities/${disabilityId}`, data);
    }
}
export default DisabilityService;