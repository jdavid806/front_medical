import BaseApiService from "./baseApiService";

export class UserService extends BaseApiService {
    async getAllUsers() {
        return await this.httpClient.get(`${this.microservice}/users`);
    }
    async getExternalId(id) {
        return await this.httpClient.get(`${this.microservice}/users/external-id/${id}`);
    }

    async getByExternalId(id) {
        return await this.httpClient.get(`${this.microservice}/users/search/${id}`);
    }
}
