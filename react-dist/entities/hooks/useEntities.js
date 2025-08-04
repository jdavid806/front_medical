import { useState, useEffect } from 'react';
import { entityService } from "../../../services/api/index.js";
import { ErrorHandler } from "../../../services/errorHandler.js";
export const useEntities = () => {
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchEntities = async () => {
    try {
      const data = await entityService.getAll();
      const mappedData = data.data.map(item => {
        return {
          ...item,
          label: item.name
        };
      });
      setEntities(mappedData);
    } catch (err) {
      ErrorHandler.generic(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchEntities();
  }, []);
  return {
    entities,
    fetchEntities,
    loading
  };
};