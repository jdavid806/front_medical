import { useState, useEffect } from 'react';
import { countryService } from '../../../services/api';
import { CountryDto } from '../../models/models';

export const useCountries = () => {
    const [countries, setCountries] = useState<CountryDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCountries = async () => {
            setLoading(true);
            try {
                const countries = await countryService.getAll();
                console.log(countries);

                setCountries(countries);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchCountries();
    }, []);

    return { countries, loading, error };
};
