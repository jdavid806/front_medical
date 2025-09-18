import BaseApiService from "./baseApiService";

export class UserRoleService extends BaseApiService {
    async storeMenusPermissions(data) {
        return await this.httpClient.post(`${this.microservice}/${this.endpoint}/menus/permissions`, data);
    }
    async updateMenusPermissions(id, data) {
        return await this.httpClient.put(`${this.microservice}/${this.endpoint}/menus/permissions/${id}`, data);
    }

    async saveRoleMenus(roleId, menuIds) {
        const numericMenuIds = menuIds.map(id => parseInt(id)).filter(id => !isNaN(id));

        const payload = {
            menus: numericMenuIds.map(menuId => ({
                menu_id: menuId,
                is_active: true
            }))
        };

        console.log('Payload a enviar:', JSON.stringify(payload, null, 2));

        return await this.httpClient.put(
            `${this.microservice}/user-roles/${roleId}/menus`,
            payload
        );
    }

}