import { useState, useEffect } from "react";
import useLocationData, { LocationOption } from "./useLocationData";

interface UseLocationDropdownsProps {
    initialCountryId?: string;
    initialDepartmentId?: string;
    initialCityId?: string;
}

const useLocationDropdowns = (props: UseLocationDropdownsProps = {}) => {
    const {
        countries,
        departments,
        cities,
        loading,
        error,
        loadCountries,
        loadDepartmentsByCountryId,
        loadCitiesByDepartmentId,
        clearData,
    } = useLocationData();

    const [selectedCountry, setSelectedCountry] = useState<string>(props.initialCountryId || "");
    const [selectedDepartment, setSelectedDepartment] = useState<string>(props.initialDepartmentId || "");
    const [selectedCity, setSelectedCity] = useState<string>(props.initialCityId || "");
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const initialize = async () => {
            await loadCountries();
            setIsInitialized(true);
        };

        initialize();
    }, []);

    // Efecto para cargar departamentos cuando hay un país seleccionado inicial
    useEffect(() => {
        if (isInitialized && selectedCountry && !departments.length) {
            loadDepartmentsByCountryId(selectedCountry);
        }
    }, [isInitialized, selectedCountry, departments.length]);

    // Efecto para cargar ciudades cuando hay un departamento seleccionado inicial
    useEffect(() => {
        if (isInitialized && selectedDepartment && !cities.length) {
            loadCitiesByDepartmentId(selectedDepartment);
        }
    }, [isInitialized, selectedDepartment, cities.length]);

    const handleCountryChange = async (countryId: string) => {
        setSelectedCountry(countryId);
        setSelectedDepartment("");
        setSelectedCity("");

        if (countryId) {
            await loadDepartmentsByCountryId(countryId);
        } else {
            clearData();
        }
    };

    const handleDepartmentChange = async (departmentId: string) => {
        setSelectedDepartment(departmentId);
        setSelectedCity("");

        if (departmentId) {
            await loadCitiesByDepartmentId(departmentId);
        } else {
            clearData();
        }
    };

    const handleCityChange = (cityId: string) => {
        setSelectedCity(cityId);
    };

    const getCurrentIds = () => ({
        countryId: selectedCountry ? parseInt(selectedCountry) : null,
        departmentId: selectedDepartment ? parseInt(selectedDepartment) : null,
        cityId: selectedCity ? parseInt(selectedCity) : null,
    });

    return {
        countryOptions: countries,
        departmentOptions: departments,
        cityOptions: cities,
        selectedCountry,
        selectedDepartment,
        selectedCity,
        handleCountryChange,
        handleDepartmentChange,
        handleCityChange,
        getCurrentIds,
        loading,
        error,
        isInitialized,
    };
};

export default useLocationDropdowns;