import { useState, useEffect } from "react";
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
                value: c.name,
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

    const loadDepartments = async (countryName: string): Promise<LocationOption[]> => {
        try {
            if (!countryName) {
                setDepartments([]);
                return [];
            }

            setLoading(true);
            setError(null);

            const country = countries.find(c => c.value === countryName);
            if (!country || !country.customProperties?.id) {
                throw new Error(`País "${countryName}" no encontrado o sin ID`);
            }

            const response = await departmentService.getByCountry(country.customProperties.id);
            const departmentsData = Array.isArray(response) ? response : response?.data || [];

            if (!Array.isArray(departmentsData)) {
                throw new Error("La respuesta de departamentos no es un array válido");
            }

            const departmentOptions = departmentsData.map((d: any) => ({
                label: d.name,
                value: d.name,
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

    const loadCities = async (departmentName: string): Promise<LocationOption[]> => {
        try {
            if (!departmentName) {
                setCities([]);
                return [];
            }

            setLoading(true);
            setError(null);

            const department = departments.find(d => d.value === departmentName);
            if (!department || !department.customProperties?.id) {
                throw new Error(`Departamento "${departmentName}" no encontrado o sin ID`);
            }

            const response = await cityService.getByDepartment(department.customProperties.id);
            const citiesData = Array.isArray(response) ? response : response?.data || [];

            if (!Array.isArray(citiesData)) {
                throw new Error("La respuesta de ciudades no es un array válido");
            }

            const cityOptions = citiesData.map((c: any) => ({
                label: c.name,
                value: c.name,
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

    const getCountryId = (countryName: string): number | null => {
        const country = countries.find(c => c.value === countryName);
        return country?.customProperties?.id || null;
    };

    const getDepartmentId = (departmentName: string): number | null => {
        const department = departments.find(d => d.value === departmentName);
        return department?.customProperties?.id || null;
    };

    const getCityId = (cityName: string): number | null => {
        const city = cities.find(c => c.value === cityName);
        return city?.customProperties?.id || null;
    };

    const getCountryName = (countryId: number): string => {
        const country = countries.find(c => c.customProperties?.id === countryId);
        return country?.label || "";
    };

    const getDepartmentName = (departmentId: number): string => {
        const department = departments.find(d => d.customProperties?.id === departmentId);
        return department?.label || "";
    };

    const getCityName = (cityId: number): string => {
        const city = cities.find(c => c.customProperties?.id === cityId);
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
        loadDepartments,
        loadCities,

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