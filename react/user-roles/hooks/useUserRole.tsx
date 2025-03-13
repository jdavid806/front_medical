import React, { useState } from "react";
import { UserRoleDto } from "../../models/models";
import { userRolesService } from "../../../services/api";
import { ErrorHandler } from "../../../services/errorHandler";

export const useUserRole = () => {
    const [userRole, setUserRole] = useState<UserRoleDto | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUserRole = async (id: string) => {
        try {
            const data = await userRolesService.get(id);
            setUserRole(data);
        } catch (err) {
            ErrorHandler.generic(err);
        } finally {
            setLoading(false);
        }
    };

    return {
        userRole,
        fetchUserRole,
        loading
    };
};
