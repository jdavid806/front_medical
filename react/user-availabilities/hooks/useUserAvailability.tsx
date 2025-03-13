import React, { useState } from "react";
import { UserAvailability } from "../../models/models";
import { userAvailabilityService } from "../../../services/api";
import { ErrorHandler } from "../../../services/errorHandler";

export const useUserAvailability = () => {
    const [userAvailability, setUserAvailability] = useState<UserAvailability | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUserAvailability = async (id: string) => {
        try {
            const data = await userAvailabilityService.get(id);
            setUserAvailability(data);
        } catch (err) {
            ErrorHandler.generic(err);
        } finally {
            setLoading(false);
        }
    };

    return {
        userAvailability,
        setUserAvailability,
        fetchUserAvailability,
        loading
    };
};
