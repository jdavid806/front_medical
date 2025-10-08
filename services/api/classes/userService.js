import { getJWTPayload } from "../../utilidades";
import BaseApiService from "./baseApiService";

export class UserService extends BaseApiService {
    async getAllUsers() {
        return await this.httpClient.get(`${this.microservice}/users`);
    }
    async getExternalId(id) {
        return await this.httpClient.get(`${this.microservice}/users/external-id/${id}`);
    }

    async getByExternalId(id) {
        const user = await this.httpClient.get(`${this.microservice}/users/search/${id}`);

        const todayAvailability = user.availabilities.find(availability => {
            return availability.days_of_week.includes(new Date().getDay()) && availability.is_active
        })

        return {
            ...user,
            today_module_name: todayAvailability?.module?.name,
            today_module_id: todayAvailability?.module_id,
        };
    }

    async getLoggedUser() {
        return await this.getByExternalId(getJWTPayload().sub);
    }

    async getMenuByRole(userId) {
        return await this.httpClient.get(`${this.microservice}/menu-by-roles/${userId}`);
    }

    async getMenuByRolePermission(roleId) {
        return await this.httpClient.get(`${this.microservice}/menus/permissions/${roleId}`);
    }

    async getPatientViewConfig() {
        return await this.httpClient.get(`${this.microservice}/users/config/patient-view`);
    }
}
