import { useState, useEffect } from 'react';
import  {retentionsService}  from '../../../../services/api'; 
import { RetentionDTO } from '../interfaces/RetentionDTO';


export const useRetentionsConfigTable = () => {
    const [retentions, setRetentions] = useState<RetentionDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRetentions = async () => {
        try {
            setLoading(true);
            setError(null);
            const data: RetentionDTO[] = await retentionsService.getRetentions();
            setRetentions(data);
        } catch (err) {
            console.error('Error fetching retentions:', err);
            setError('Error al cargar las retenciones');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRetentions();
    }, []);

    return { 
        retentions, 
        loading, 
        error, 
        refreshRetentions: fetchRetentions 
    };
};