import BaseApiService from "./baseApiService.js";

export class DisabilityService extends BaseApiService {
    async getAll(id) {
        return await this.httpClient.get(`medical/patients/${id}/disabilities`);
    }

    async getById(id) {
        return await this.httpClient.get(`medical/patients/disabilities/${id}`);
    }
}
export default DisabilityService;