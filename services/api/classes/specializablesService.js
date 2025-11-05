import BaseApiService from './baseApiService.js';

export class SpecializablesService extends BaseApiService {
    async getPastClinicalRecordByCurrentUserSpecialty() {
        return await this.httpClient.get(`medical/specializables/current-user/past-clinical-record`)
    }
}