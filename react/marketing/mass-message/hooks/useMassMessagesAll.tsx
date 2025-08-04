import React, { useEffect, useState } from "react";
// import { comissionConfig } from "../../../services/api";
import { ErrorHandler } from "../../../../services/errorHandler";

export const useMassMessagesAll = () => {
    const [massMessages, setMassMessages] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchMassMessages = async () => {
        try {
            // const data = await comissionConfig.comissionConfigGetById(id);
            const data = [
                {
                    id: "1",
                    title: "Mensaje de prueba 1",
                    message: "Este es un primer mensaje.",
                    specialty: "General",
                },
                {
                    id: "2",
                    title: "Mensaje de prueba 2",
                    message: "este es un segundo mensaje.",
                    specialty: "Dermatología",
                },
                {
                    id: "3",
                    title: "Mensaje de prueba 3",
                    message: "Este es un tercer mensaje.",
                    specialty: "Pediatría",
                },
            ]
            setMassMessages(data);
        } catch (err) {
            ErrorHandler.generic(err);
        } finally {
            setLoading(false);
        }
    };
    return {
        massMessages,
        setMassMessages,
        fetchMassMessages,
    };
};
