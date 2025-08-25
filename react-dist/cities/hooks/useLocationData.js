import { useState } from "react";
import { countryService, departmentService, cityService } from "../../../services/api/index.js";
const useLocationData = () => {
  const [countries, setCountries] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const loadCountries = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await countryService.getAll();
      const countryOptions = response.data.map(c => ({
        label: c.name,
        value: c.id.toString(),
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
  const loadDepartmentsByCountryId = async countryId => {
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
      const departmentOptions = departmentsData.map(d => ({
        label: d.name,
        value: d.id.toString(),
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
  const loadCitiesByDepartmentId = async departmentId => {
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
      const cityOptions = citiesData.map(c => ({
        label: c.name,
        value: c.id.toString(),
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
  const getCountryId = countryValue => {
    const country = countries.find(c => c.value === countryValue);
    return country ? parseInt(country.value) : null;
  };
  const getDepartmentId = departmentValue => {
    const department = departments.find(d => d.value === departmentValue);
    return department ? parseInt(department.value) : null;
  };
  const getCityId = cityValue => {
    const city = cities.find(c => c.value === cityValue);
    return city ? parseInt(city.value) : null;
  };
  const getCountryName = countryId => {
    const country = countries.find(c => parseInt(c.value) === countryId);
    return country?.label || "";
  };
  const getDepartmentName = departmentId => {
    const department = departments.find(d => parseInt(d.value) === departmentId);
    return department?.label || "";
  };
  const getCityName = cityId => {
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
    clearData
  };
};
export default useLocationData;