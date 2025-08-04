import React, { useState } from "react";
// import { comissionConfig } from "../../../services/api";
import { ErrorHandler } from "../../../../services/errorHandler";

export const useMassMessage = () => {
    const [massMessage, setMassMessage] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchMassMessage = async (id: string) => {
        try {
            // const data = await comissionConfig.comissionConfigGetById(id);
            const data = [
                {
                    id: "1",
                    title: "Mass Message 1",
                    message: "This is the first mass message.",
                    specialty: "General",
                },
                {
                    id: "2",
                    title: "Mass Message 2",
                    message: "This is the second mass message.",
                    specialty: "Specialty A",
                },
                {
                    id: "3",
                    title: "Mass Message 3",
                    message: "This is the third mass message.",
                    specialty: "Specialty B",
                },
            ]
            setMassMessage(data);
        } catch (err) {
            ErrorHandler.generic(err);
        } finally {
            setLoading(false);
        }
    };

    return {
        massMessage,
        setMassMessage,
        fetchMassMessage,
        loading
    };
};
