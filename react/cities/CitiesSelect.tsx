import React, { useState } from 'react';
import { CustomSelect } from '../components/CustomSelect';
import { useId } from 'react';
import { useCities } from './hooks/useCities';

interface CitiesSelectProps {
    multiple?: boolean;
    required?: boolean;
    onSelect: (countries: string[]) => void;
}

export const CitiesSelect: React.FC<CitiesSelectProps> = ({ multiple, required = false, onSelect }) => {
    const [selectedCities, setSelectedCities] = useState<string[]>([]);
    const { cities } = useCities();
    const id = useId()

    const handleChange = (countries: string[]) => {
        setSelectedCities(countries);
        onSelect(countries);
    };

    return (
        <>
            <CustomSelect
                selectId={id}
                options={cities.map(city => ({ value: city.id, label: city.name }))}
                value={selectedCities}
                required={required}
                onChange={handleChange}
                multiple={multiple}
                label='Ciudad'
            />
        </>
    );
};

