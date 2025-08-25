import { useState } from "react";
import {
    countryService,
    departmentService,
    cityService,
} from "../../../services/api";

export interface Country {
    id: number;
    name: string;
}

export interface Department {
    id: number;
    name: string;
    country_id: number;
}

export interface City {
    id: number;
    name: string;
    department_id: number;
}

export interface LocationOption {
    label: string;
    value: string;
    customProperties: any;
}

const useLocationData = () => {
    const [countries, setCountries] = useState<LocationOption[]>([]);
    const [departments, setDepartments] = useState<LocationOption[]>([]);
    const [cities, setCities] = useState<LocationOption[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadCountries = async (): Promise<LocationOption[]> => {
        try {
            setLoading(true);
            setError(null);
            const response = await countryService.getAll();

            const countryOptions = response.data.map((c: any) => ({
                label: c.name,
                value: c.id.toString(),
                customProperties: c,
            }));

            setCountries(countryOptions);
            return countryOptions;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Error al cargar países";
            setError(errorMessage);
            console.error("Error loading countries:", err);
            return [];
        } finally {
            setLoading(false);
        }
    };

    const loadDepartmentsByCountryId = async (countryId: string): Promise<LocationOption[]> => {
        try {
            if (!countryId) {
                setDepartments([]);
                return [];
            }

            setLoading(true);
            setError(null);

            const response = await departmentService.getByCountry(parseInt(countryId));
            const departmentsData = Array.isArray(response) ? response : response?.data || [];

            if (!Array.isArray(departmentsData)) {
                throw new Error("La respuesta de departamentos no es un array válido");
            }

            const departmentOptions = departmentsData.map((d: any) => ({
                label: d.name,
                value: d.id.toString(),
                customProperties: {
                    id: d.id,
                    ...d,
                },
            }));

            setDepartments(departmentOptions);
            return departmentOptions;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Error al cargar departamentos";
            setError(errorMessage);
            console.error("Error loading departments:", err);
            return [];
        } finally {
            setLoading(false);
        }
    };

    const loadCitiesByDepartmentId = async (departmentId: string): Promise<LocationOption[]> => {
        try {
            if (!departmentId) {
                setCities([]);
                return [];
            }

            setLoading(true);
            setError(null);

            const response = await cityService.getByDepartment(parseInt(departmentId));
            const citiesData = Array.isArray(response) ? response : response?.data || [];

            if (!Array.isArray(citiesData)) {
                throw new Error("La respuesta de ciudades no es un array válido");
            }

            const cityOptions = citiesData.map((c: any) => ({
                label: c.name,
                value: c.id.toString(),
                customProperties: c,
            }));

            setCities(cityOptions);
            return cityOptions;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Error al cargar ciudades";
            setError(errorMessage);
            console.error("Error loading cities:", err);
            return [];
        } finally {
            setLoading(false);
        }
    };

    const getCountryId = (countryValue: string): number | null => {
        const country = countries.find(c => c.value === countryValue);
        return country ? parseInt(country.value) : null;
    };

    const getDepartmentId = (departmentValue: string): number | null => {
        const department = departments.find(d => d.value === departmentValue);
        return department ? parseInt(department.value) : null;
    };

    const getCityId = (cityValue: string): number | null => {
        const city = cities.find(c => c.value === cityValue);
        return city ? parseInt(city.value) : null;
    };

    const getCountryName = (countryId: number): string => {
        const country = countries.find(c => parseInt(c.value) === countryId);
        return country?.label || "";
    };

    const getDepartmentName = (departmentId: number): string => {
        const department = departments.find(d => parseInt(d.value) === departmentId);
        return department?.label || "";
    };

    const getCityName = (cityId: number): string => {
        const city = cities.find(c => parseInt(c.value) === cityId);
        return city?.label || "";
    };

    const clearData = () => {
        setDepartments([]);
        setCities([]);
    };

    return {
        countries,
        departments,
        cities,
        setCities,
        loading,
        error,
        loadCountries,
        loadDepartmentsByCountryId,
        loadCitiesByDepartmentId,
        getCountryId,
        getDepartmentId,
        getCityId,
        getCountryName,
        getDepartmentName,
        getCityName,
        clearData,
    };
};

export default useLocationData;