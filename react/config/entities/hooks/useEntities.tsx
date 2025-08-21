import { useState, useEffect } from "react";
import { entityService } from "../../../../services/api";

export interface EntityOption {
    label: string;
    value: string;
}

const useEntities = () => {
    const [entities, setEntities] = useState<EntityOption[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadEntities = async (): Promise<EntityOption[]> => {
        try {
            setLoading(true);
            setError(null);

            const response = await entityService.getAll();
            const entityOptions = response.data.map((e: any) => ({
                label: e.name,
                value: e.id.toString(),
            }));

            setEntities(entityOptions);
            return entityOptions;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Error al cargar entidades";
            setError(errorMessage);
            console.error("Error loading entities:", err);
            return [];
        } finally {
            setLoading(false);
        }
    };

    const getEntityName = (entityId: string): string => {
        const entity = entities.find(e => e.value === entityId);
        return entity?.label || "";
    };

    const getEntityId = (entityName: string): string => {
        const entity = entities.find(e => e.label === entityName);
        return entity?.value || "";
    };

    useEffect(() => {
        loadEntities();
    }, []);

    return {
        entities,
        loading,
        error,
        loadEntities,
        getEntityName,
        getEntityId,
    };
};

export default useEntities;