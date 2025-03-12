import { useState, useEffect } from 'react';
import { cityService } from "../../../services/api/index.js";
export const useCities = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchCities = async () => {
      setLoading(true);
      const data = await cityService.getAll();
      setCities(data.data);
      setLoading(false);
    };
    fetchCities();
  }, []);
  return {
    cities,
    loading
  };
};