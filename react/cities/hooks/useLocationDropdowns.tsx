import { useState, useEffect } from "react";
import useLocationData, { LocationOption } from "./useLocationData";

interface UseLocationDropdownsProps {
    initialCountry?: string;
    initialDepartment?: string;
    initialCity?: string;
}

const useLocationDropdowns = (props: UseLocationDropdownsProps = {}) => {
    const {
        countries,
        departments,
        cities,
        loading,
        error,
        loadCountries,
        loadDepartments,
        loadCities,
        getCountryId,
        getDepartmentId,
        getCityId,
        clearData,
        getCountryName,
        getDepartmentName,
        getCityName,
        setCities

    } = useLocationData();

    const [selectedCountry, setSelectedCountry] = useState<string>(props.initialCountry || "");
    const [selectedDepartment, setSelectedDepartment] = useState<string>(props.initialDepartment || "");
    const [selectedCity, setSelectedCity] = useState<string>(props.initialCity || "");
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const initialize = async () => {
            await loadCountries();
            setIsInitialized(true);
        };

        initialize();
    }, []);

    const handleCountryChange = async (countryName: string) => {
        setSelectedCountry(countryName);
        setSelectedDepartment("");
        setSelectedCity("");

        if (countryName) {
            await loadDepartments(countryName);
        } else {
            clearData();
        }
    };

    const handleDepartmentChange = async (departmentName: string) => {
        setSelectedDepartment(departmentName);
        setSelectedCity("");

        if (departmentName) {
            await loadCities(departmentName);
        } else {
            setCities([]);
        }
    };

    const handleCityChange = (cityName: string) => {
        setSelectedCity(cityName);
    };

    const setInitialValuesFromIds = async (countryId?: number, departmentId?: number, cityId?: number) => {
        if (!isInitialized) return;

        if (countryId) {
            const countryName = getCountryName(countryId);
            if (countryName) {
                await handleCountryChange(countryName);

                if (departmentId) {
                    const departmentName = getDepartmentName(departmentId);
                    if (departmentName) {
                        await handleDepartmentChange(departmentName);

                        if (cityId) {
                            const cityName = getCityName(cityId);
                            if (cityName) {
                                handleCityChange(cityName);
                            }
                        }
                    }
                }
            }
        }
    };

    const getCurrentIds = () => ({
        countryId: getCountryId(selectedCountry),
        departmentId: getDepartmentId(selectedDepartment),
        cityId: getCityId(selectedCity),
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
        setInitialValuesFromIds,

        loading,
        error,
        isInitialized,
    };
};

export default useLocationDropdowns;