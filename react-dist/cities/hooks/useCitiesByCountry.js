import { useState } from 'react';
import { cityService } from "../../../services/api/index.js";
export const useCitiesByCountry = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isInitialCitiesLoad, setIsInitialCitiesLoad] = useState(true);
  const fetchCities = async countryId => {
    setLoading(true);
    const data = await cityService.getByCountry(countryId);
    setCities(data);
    setLoading(false);
  };
  return {
    cities,
    loading,
    fetchCities,
    isInitialCitiesLoad,
    setIsInitialCitiesLoad
  };
};