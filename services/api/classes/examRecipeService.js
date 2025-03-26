import BaseApiService from "./baseApiService";

export class ExamRecipeService extends BaseApiService {
    async ofPatient(patientId) {
        return await this.httpClient.get(`${this.microservice}/${this.endpoint}/of-patient/${patientId}`);
    }
}
