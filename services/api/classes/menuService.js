import BaseApiService from "./baseApiService";
import { UserService } from "./userService";

export class MenuService extends BaseApiService {

    async getAll() {
        const currentUser = await new UserService("medical", "users").getLoggedUser();
        const roleId = currentUser.role.id;
        try {
            const response = await this.httpClient.get(`medical/menus/permissions/${roleId}`);

            console.log('Response menus:', response);

            return response.menus.map(item => ({
                id: item.id,
                name: item.label,
                key_: item.key,
                route: item.url || null,
                is_active: false
            }));
        } catch (error) {
            console.error("Error fetching menu by permission:", error);
            throw error;
        }
    }
}