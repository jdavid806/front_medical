import React, { useState } from 'react';
import { useCountries } from './hooks/useCountries';
import { useId } from 'react';
import { CustomSelect } from '../components/CustomSelect';

interface CountriesSelectProps {
    multiple?: boolean;
    required?: boolean;
    onSelect: (countries: string[]) => void;
}

const CountriesSelect: React.FC<CountriesSelectProps> = ({ multiple, required = false, onSelect }) => {
    const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
    const { countries } = useCountries();
    const id = useId()

    const handleChange = (countries: string[]) => {
        setSelectedCountries(countries);
        onSelect(countries);
    };

    return (
        <>
            <CustomSelect
                selectId={id}
                options={countries.map(country => ({ value: country.id, label: country.name }))}
                value={selectedCountries}
                required={required}
                onChange={handleChange}
                multiple={multiple}
                label='País'
            />
        </>
    );
};

export default CountriesSelect;

