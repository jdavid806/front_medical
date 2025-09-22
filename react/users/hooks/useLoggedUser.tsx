import React, { useEffect, useState } from "react";
import { UserDto } from "../../models/models";
import { userService } from "../../../services/api";
import { ErrorHandler } from "../../../services/errorHandler";
import { getJWTPayload } from "../../../services/utilidades";

export const useLoggedUser = () => {
    const [loggedUser, setLoggedUser] = useState<UserDto | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const data = await userService.getByExternalId(getJWTPayload().sub);

            setLoggedUser(data);
        } catch (err) {
            ErrorHandler.generic(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return {
        loggedUser,
        loading
    };
};
