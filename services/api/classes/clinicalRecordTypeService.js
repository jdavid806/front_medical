import BaseApiService from './baseApiService.js';

export class ClinicalRecordTypeService extends BaseApiService {
    async getAll(id) {
        return await this.httpClient.get(`${this.microservice}/clinical-record-types`);
    }
}

export default ClinicalRecordTypeService;