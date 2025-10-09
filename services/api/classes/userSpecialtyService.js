import BaseApiService from "./baseApiService";

export class UserSpecialtyService extends BaseApiService {
    async getAllItems() {
        return await this.httpClient.get(`${this.microservice}/user-specialties`)
    }

    async updatePatientViewConfig(id, data) {
        return await this.httpClient.patch(`${this.microservice}/user-specialties/${id}/update-patient-view-config`, data)
    }
}
