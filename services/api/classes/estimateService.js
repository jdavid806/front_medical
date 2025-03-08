import BaseApiService from './baseApiService.js';

export class EstimateService extends BaseApiService {
    async getAllEstimates() {
        return await this.httpClient.get(`${this.microservice}/estimates-all`);
    }
    async createEstimates(data) {
        return await this.httpClient.post(`${this.microservice}/estimate-create`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}

export default EstimateService;