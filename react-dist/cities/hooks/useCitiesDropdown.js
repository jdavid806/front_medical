// hooks/useLocationDropdowns.ts
import { useState, useEffect } from "react";
import useLocationData from "./useLocationData.js";
const useLocationDropdowns = (props = {}) => {
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
    clearData
  } = useLocationData();
  const [selectedCountry, setSelectedCountry] = useState(props.initialCountry || "");
  const [selectedDepartment, setSelectedDepartment] = useState(props.initialDepartment || "");
  const [selectedCity, setSelectedCity] = useState(props.initialCity || "");
  const [isInitialized, setIsInitialized] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    const initialize = async () => {
      await loadCountries();
      setIsInitialized(true);
    };
    initialize();
  }, []);

  // Cuando se selecciona un país
  const handleCountryChange = async countryName => {
    setSelectedCountry(countryName);
    setSelectedDepartment("");
    setSelectedCity("");
    if (countryName) {
      await loadDepartments(countryName);
    } else {
      clearData();
    }
  };

  // Cuando se selecciona un departamento
  const handleDepartmentChange = async departmentName => {
    setSelectedDepartment(departmentName);
    setSelectedCity("");
    if (departmentName) {
      await loadCities(departmentName);
    } else {
      setCities([]);
    }
  };

  // Cuando se selecciona una ciudad
  const handleCityChange = cityName => {
    setSelectedCity(cityName);
  };

  // Establecer valores iniciales basados en IDs
  const setInitialValuesFromIds = async (countryId, departmentId, cityId) => {
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

  // Obtener IDs actuales
  const getCurrentIds = () => ({
    countryId: getCountryId(selectedCountry),
    departmentId: getDepartmentId(selectedDepartment),
    cityId: getCityId(selectedCity)
  });
  return {
    // Opciones para dropdowns
    countryOptions: countries,
    departmentOptions: departments,
    cityOptions: cities,
    // Valores seleccionados
    selectedCountry,
    selectedDepartment,
    selectedCity,
    // Handlers para cambios
    handleCountryChange,
    handleDepartmentChange,
    handleCityChange,
    // Funciones utilitarias
    getCurrentIds,
    setInitialValuesFromIds,
    // Estado
    loading,
    error,
    isInitialized
  };
};
export default useLocationDropdowns;