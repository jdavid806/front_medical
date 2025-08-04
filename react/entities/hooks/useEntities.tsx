import { useState, useEffect } from 'react';
import { entityService } from '../../../services/api';
import { ErrorHandler } from '../../../services/errorHandler';
import { EntityDto } from '../../models/models';

export const useEntities = () => {
    const [entities, setEntities] = useState<EntityDto[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchEntities = async () => {
        try {
            const data = await entityService.getAll();
            const mappedData: EntityDto[] = data.data.map((item: EntityDto) => {
                return {
                    ...item,
                    label: item.name,
                };
            });

            setEntities(mappedData);
        } catch (err) {
            ErrorHandler.generic(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEntities();
    }, []);

    return {
        entities,
        fetchEntities,
        loading
    };
};
