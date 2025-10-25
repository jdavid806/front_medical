import BaseApiService from "./baseApiService";

export class UserRoleService extends BaseApiService {
    async storeMenusPermissions(data) {
        return await this.httpClient.post(`${this.microservice}/${this.endpoint}/menus/permissions`, data);
    }
    async updateMenusPermissions(id, data) {
        return await this.httpClient.put(`${this.microservice}/${this.endpoint}/menus/permissions/${id}`, data);
    }
    async saveRoleMenus(roleId, menusPayload) {
    try {
        console.log('Payload recibido en saveRoleMenus:', menusPayload);
        
        return await this.httpClient.put(
            `${this.microservice}/user-roles/${roleId}/menus`,
            { menus: menusPayload }
        );
    } catch (error) {
        console.error('Error saving role menus:', error);
        throw error;
    }
}

    async updateRoleMenus(roleId, menus) {
        console.log(menus, "menusserviceeeeeee")
        try {
            const activeMenus = menus.filter(menu => menu.is_active);

            const payload = {
                menus: activeMenus.map(menu => ({
                    menu_id: menu.id,
                    is_active: true
                }))
            };

            console.log('Payload a enviar:', JSON.stringify(payload, null, 2));

            return await this.httpClient.put(
                `${this.microservice}/user-roles/${roleId}/menus`,
                payload
            );
        } catch (error) {
            console.error('Error saving role menus:', error);
            throw error;
        }
    }

    async updateRolePermissions(id, data) {
        return await this.httpClient.put(`${this.microservice}/${this.endpoint}/user-roles/${id}`, data);
    }

    async updateGroupRole(roleId, payload) {
        try {
            const response = await this.httpClient.put(`medical/user-roles/${roleId}`, payload);
            console.log(response)
            return response.menus || [];

        } catch (error) {
            console.error("Error fetching menu by permission:", error);
            throw error;
        }
    }

    async createRoleUserMenu(payload) {
        try {
            const response = await this.httpClient.post('medical/user-roles', payload);
            console.log(response)
            return response.menus || [];

        } catch (error) {
            console.error("Error fetching menu by permission:", error);
            throw error;
        }
    }

    async deleteRole(id) {
        return await this.httpClient.delete(`medical/menus/user-roles/${id}`)
    }
}