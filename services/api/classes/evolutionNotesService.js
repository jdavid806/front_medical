import BaseApiService from './baseApiService.js';

export class EvolutionNotesService extends BaseApiService {
    async getEvolutionsByClinicalRecord(id) {
        return await this.httpClient.get(`${this.microservice}/clinical-records/${id}/evolution-notes`);
    }
    async getEvolutionsByParams(startDate, endDate, user_id, patient_id) {
        return await this.httpClient.get(`${this.microservice}/evolution-notes/by-params/${startDate}/${endDate}/${user_id}/${patient_id}`);
    }
    async createEvolutionNotes(data, id) {
        return await this.httpClient.post(`${this.microservice}/clinical-records/${id}/evolution-notes`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}

export default EvolutionNotesService;