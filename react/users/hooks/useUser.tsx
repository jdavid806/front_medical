import React, { useState } from "react";
import { UserDto } from "../../models/models";
import { userService } from "../../../services/api";
import { ErrorHandler } from "../../../services/errorHandler";

export const useUser = () => {
    const [user, setUser] = useState<UserDto | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async (id: string) => {
        try {
            const data = await userService.get(id);
            setUser(data);
        } catch (err) {
            ErrorHandler.generic(err);
        } finally {
            setLoading(false);
        }
    };

    return {
        user,
        setUser,
        fetchUser,
        loading
    };
};
