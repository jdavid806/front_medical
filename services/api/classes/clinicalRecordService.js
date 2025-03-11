import OneToManyService from './oneToManyService.js';

export class ClinicalRecordService extends OneToManyService {
    async clinicalRecordsParamsStore(patientId, data) {
        return await this.httpClient.post(`${this.microservice}/clinical-records-params/${patientId}`, data);
    }
}

export default ClinicalRecordService;