import BaseApiService from './baseApiService.js';

export class RemissionService extends BaseApiService {
    async getRemissionsByClinicalRecord(id) {
        return await this.httpClient.get(`${this.microservice}/clinical-records/${id}/remissions`);
    }
    async getRemissionsByParams(startDate, endDate, user_id, patient_id) {
        return await this.httpClient.get(`${this.microservice}/remissions/by-params/${startDate}/${endDate}/${user_id}/${patient_id}`);
    }
    async createRemission(data, id) {
        return await this.httpClient.post(`${this.microservice}/clinical-records/${id}/remissions`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}

export default RemissionService;