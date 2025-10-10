import BaseApiService from "./baseApiService";

export class UserRoleService extends BaseApiService {
    async storeMenusPermissions(data) {
        return await this.httpClient.post(`${this.microservice}/${this.endpoint}/menus/permissions`, data);
    }
    async updateMenusPermissions(id, data) {
        return await this.httpClient.put(`${this.microservice}/${this.endpoint}/menus/permissions/${id}`, data);
    }
    async saveRoleMenus(roleId, menus) {
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
}