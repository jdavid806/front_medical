import BaseApiService from "./baseApiService";

export class CentralSpecialtyService extends BaseApiService {
    async activateSpecialty(specialtyName) {
        return await this.httpClient.post(`medical/specialties/activate/${specialtyName}`, {})
    }

    async deactivateSpecialty(specialtyName) {
        return await this.httpClient.post(`medical/specialties/deactivate/${specialtyName}`, {})
    }
}