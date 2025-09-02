import React, { useEffect, useState } from "react";
import { farmaciaService } from "../../../services/api";

export const useVaccines = () => {
    const [vaccines, setVaccines] = useState<any[]>([]);

    const fetchVaccines = async () => {
        try {
            const data = await farmaciaService.getAllVacunas();
            const mappedData = data.map((vaccine: any) => ({
                ...vaccine,
                label: vaccine.name + (vaccine.concentration ? " - " + vaccine.concentration : "")
            }));
            setVaccines(mappedData);
        } catch (error: any) {
            console.error("Error fetching vaccines:", error);
            setVaccines([]);
            throw error;
        }
    };

    useEffect(() => {
        fetchVaccines();
    }, []);

    return { vaccines, fetchVaccines };
};