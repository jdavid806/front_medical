import { useState } from 'react';
import { cityService } from '../../../services/api';
import { CityDto } from '../../models/models';

export const useCitiesByCountry = () => {
    const [cities, setCities] = useState<CityDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [isInitialCitiesLoad, setIsInitialCitiesLoad] = useState(true);

    const fetchCities = async (countryId: string) => {
        setLoading(true);
        const data = await cityService.getByCountry(countryId);
        setCities(data);
        setLoading(false);
    };

    return { cities, loading, fetchCities, isInitialCitiesLoad, setIsInitialCitiesLoad };
};
