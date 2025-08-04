import React, { useState } from "react";
import { userAbsenceService } from "../../../services/api";
import { ErrorHandler } from "../../../services/errorHandler";
import { UserAbsenceDto } from "../../models/models";

export const useUserAbsence = () => {
    const [userAbsence, setUserAbsence] = useState<UserAbsenceDto | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUserAbsence = async (id: string) => {
        try {
            const data = await userAbsenceService.get(id);
            setUserAbsence(data);
        } catch (err) {
            ErrorHandler.generic(err);
        } finally {
            setLoading(false);
        }
    };

    return {
        userAbsence,
        setUserAbsence,
        fetchUserAbsence,
        loading
    };
};
