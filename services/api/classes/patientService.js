import BaseApiService from "./baseApiService";

export class PatientService extends BaseApiService {
    async evolution(id) {
        return await this.httpClient.get(this.microservice + "/" + this.endpoint + '/evolution/' + id);
    }

    async storePatient(data) {
        return await this.httpClient.post(this.microservice + "/" + 'patients-companion-social-security', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    async findByField({ field, value }) {
        return await this.httpClient.post(this.microservice + "/" + this.endpoint + '/find-by/field', {
            field,
            value
        });
    }
}
