import { useState, useEffect } from 'react';
import { entitiesService } from "../../../../services/api";
import { EntitiesDTO } from '../interfaces/entitiesDTO';



export const useEntitieConfigTable = () => {
    const [entities, setEntities] = useState<EntitiesDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchEntities = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await entitiesService.getEntities();
            const data: EntitiesDTO[] = response.data || [];
            console.log("Datos de entidades:", data);
            setEntities(data);
        } catch (err) {
            console.error('Error fetching entities:', err);
            setError('Error al cargar las entidades');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEntities();
    }, []);

    return {
        entities,
        loading,
        error,
        refreshEntities: fetchEntities
    };
};