import { useState } from "react";
import { ErrorHandler } from "../../../../services/errorHandler";
import { entitiesService } from "../../../../services/api";
import { EntitiesDTO } from "../interfaces/entitiesDTO";

export const useEntitieConfigById = () => {
    const [entitiesById, setEntitiesById] = useState<EntitiesDTO | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchEntitiesById = async (id: string) => {
        setLoading(true);
        try {
            const data = await entitiesService.getEntityById(id);
            setEntitiesById(data);
            return data;
        } catch (err) {
            ErrorHandler.generic(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        entitiesById,
        setEntitiesById,
        fetchEntitiesById,
        loading
    };
};