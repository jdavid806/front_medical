// hooks/useLocationData.ts
import { useState } from "react";
import { countryService, departmentService, cityService } from "../../../services/api/index.js";
const useLocationData = () => {
  const [countries, setCountries] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar países
  const loadCountries = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await countryService.getAll();
      const countryOptions = response.data.map(c => ({
        label: c.name,
        value: c.name,
        customProperties: c
      }));
      setCountries(countryOptions);
      return countryOptions;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error al cargar países";
      setError(errorMessage);
      console.error("Error loading countries:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Cargar departamentos por país
  const loadDepartments = async countryName => {
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
      const departmentOptions = departmentsData.map(d => ({
        label: d.name,
        value: d.name,
        customProperties: {
          id: d.id,
          ...d
        }
      }));
      setDepartments(departmentOptions);
      return departmentOptions;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error al cargar departamentos";
      setError(errorMessage);
      console.error("Error loading departments:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Cargar ciudades por departamento
  const loadCities = async departmentName => {
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
      const cityOptions = citiesData.map(c => ({
        label: c.name,
        value: c.name,
        customProperties: c
      }));
      setCities(cityOptions);
      return cityOptions;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error al cargar ciudades";
      setError(errorMessage);
      console.error("Error loading cities:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Obtener ID del país por nombre
  const getCountryId = countryName => {
    const country = countries.find(c => c.value === countryName);
    return country?.customProperties?.id || null;
  };

  // Obtener ID del departamento por nombre
  const getDepartmentId = departmentName => {
    const department = departments.find(d => d.value === departmentName);
    return department?.customProperties?.id || null;
  };

  // Obtener ID de la ciudad por nombre
  const getCityId = cityName => {
    const city = cities.find(c => c.value === cityName);
    return city?.customProperties?.id || null;
  };

  // Obtener nombre del país por ID
  const getCountryName = countryId => {
    const country = countries.find(c => c.customProperties?.id === countryId);
    return country?.label || "";
  };

  // Obtener nombre del departamento por ID
  const getDepartmentName = departmentId => {
    const department = departments.find(d => d.customProperties?.id === departmentId);
    return department?.label || "";
  };

  // Obtener nombre de la ciudad por ID
  const getCityName = cityId => {
    const city = cities.find(c => c.customProperties?.id === cityId);
    return city?.label || "";
  };

  // Limpiar datos
  const clearData = () => {
    setDepartments([]);
    setCities([]);
  };
  return {
    // Datos
    countries,
    departments,
    cities,
    setCities,
    // Estado
    loading,
    error,
    // Funciones de carga
    loadCountries,
    loadDepartments,
    loadCities,
    // Funciones utilitarias
    getCountryId,
    getDepartmentId,
    getCityId,
    getCountryName,
    getDepartmentName,
    getCityName,
    // Limpieza
    clearData
  };
};
export default useLocationData;