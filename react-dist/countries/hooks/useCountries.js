import { useState, useEffect } from 'react';
import { countryService } from "../../../services/api/index.js";
export const useCountries = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true);
      try {
        const countries = await countryService.getAll();
        console.log(countries);
        setCountries(countries);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCountries();
  }, []);
  return {
    countries,
    loading,
    error
  };
};