import { userService } from "./api/index.js";

const UserManager = (() => {
    let userData = null;
    let permissions = null;
    let menus = null;
    let role = null;
    let authListeners = [];

    const decodeToken = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            return JSON.parse(atob(base64));
        } catch (error) {
            console.error('Error decoding JWT:', error);
            return null;
        }
    };

    const fetchUserData = async () => {
        const token = sessionStorage.getItem('auth_token');

        if (!token) {
            notifyAuthChange(false);
            return null;
        }

        try {
            const decoded = decodeToken(token);
            const data = await userService.getByExternalId(decoded.sub);
            const { role: roleData, ...rest } = data;

            userData = rest;
            permissions = roleData.permissions;
            menus = roleData.menus;
            role = roleData;
            localStorage.setItem('userData', JSON.stringify(data));
            notifyAuthChange(true);
            return data;
        } catch (error) {
            console.error('Error:', error);
            logout();
            return null;
        }
    };

    const notifyAuthChange = (isAuthenticated) => {
        authListeners.forEach(callback => callback(isAuthenticated, userData, permissions, menus, role));
    };

    return {
        initialize: () => {
            const savedData = localStorage.getItem('userData');
            if (savedData) userData = JSON.parse(savedData);

            window.addEventListener('DOMContentLoaded', async () => {
                await fetchUserData();
            });
        },

        getUser: () => userData,
        getPermissions: () => permissions,
        getMenus: () => menus,

        refreshUser: async () => {
            return await fetchUserData();
        },

        logout: () => {
            localStorage.removeItem('jwt');
            localStorage.removeItem('userData');
            userData = null;
            notifyAuthChange(false);
        },

        onAuthChange: (callback) => {
            authListeners.push(callback);
            callback(!!userData, userData, permissions, menus, role);
        }
    };
})();

UserManager.initialize();

export default UserManager;