import { useState, useEffect } from 'react';
import { specializablesService } from '../../../services/api';
import { ErrorHandler } from '../../../services/errorHandler';
import { SpecializableDto } from '../../models/models';

export const useSpecializables = () => {
    const [specializables, setSpecializables] = useState<SpecializableDto[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSpecializables = async () => {
        try {
            const data: SpecializableDto[] = await specializablesService.getAll();
            setSpecializables(data);
        } catch (err) {
            ErrorHandler.generic(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSpecializables();
    }, []);

    return {
        specializables,
        fetchSpecializables,
        loading
    };
};
