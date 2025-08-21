import { useState, useEffect } from 'react';
import { cityService } from '../../../services/api';
import { CityDto } from '../../models/models';

export const useCities = () => {
    const [cities, setCities] = useState<CityDto[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCities = async () => {
            setLoading(true);
            const data = await cityService.getAll();
            setCities(data);
            setLoading(false);
        };

        fetchCities();
    }, []);

    return { cities, loading };
};
