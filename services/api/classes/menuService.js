import BaseApiService from "./baseApiService";
import { UserService } from "./userService";

export class MenuService extends BaseApiService {

    async getAll() {
        try {
            const response = await this.httpClient.get(`${this.microservice}medical/menus/submenus`);
            console.log(response)
            const allChildItems = [];

            function extractChildren(items) {
                if (!items || !Array.isArray(items)) return;

                items.forEach(item => {
                    if (item.items && item.items.length > 0) {
                        extractChildren(item.items);
                    }
                    if (item.parent_id !== null) {
                        allChildItems.push({
                            id: item.id,
                            name: item.label,
                            items: item.key,
                            route: item.url || null,
                            is_active: false
                        });
                    }
                });
            }

            if (response.menus && Array.isArray(response.menus)) {
                response.menus.forEach(menu => {
                    if (menu.items && menu.items.length > 0) {
                        extractChildren(menu.items);
                    }
                });
            }

            return allChildItems;

        } catch (error) {
            console.error("Error fetching menu by permission:", error);
            throw error;
        }
    }

    async getAllMenu() {
        const dataUser = localStorage.getItem("userData")
        const user = JSON.parse(dataUser)
        const user_id = user?.id;

        try {
            return await this.httpClient.get(`medical/menu-by-roles/${user_id}`);
        } catch (error) {
            console.error("Error fetching all menus:", error);
            throw error;
        }
    }
}