import BaseApiService from "./baseApiService";

export class UserRoleService extends BaseApiService {
    async storeMenusPermissions(data) {
        return await this.httpClient.post(`${this.microservice}/${this.endpoint}/menus/permissions`, data);
    }
    async updateMenusPermissions(id, data) {
        return await this.httpClient.put(`${this.microservice}/${this.endpoint}/menus/permissions/${id}`, data);
    }
}