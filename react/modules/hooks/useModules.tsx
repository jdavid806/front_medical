import { useState, useEffect } from 'react';
import { moduleService } from '../../../services/api';
import { ErrorHandler } from '../../../services/errorHandler';
import { ModuleDto } from '../../models/models';

export const useModules = () => {
    const [modules, setModules] = useState<ModuleDto[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchModules = async () => {
        try {
            const data = await moduleService.active();
            setModules(data);
        } catch (err) {
            ErrorHandler.generic(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchModules();
    }, []);

    return {
        modules,
        fetchModules,
        loading
    };
};

