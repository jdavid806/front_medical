import BaseApiService from "./baseApiService";

export class UserSpecialtyService extends BaseApiService {
    async getAllItems() {
        return await this.httpClient.get(`${this.microservice}/user-specialties`)
    }
}
