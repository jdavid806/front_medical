import { useState } from "react";
import { ErrorHandler } from "../../../../services/errorHandler.js";
import { entitiesService } from "../../../../services/api/index.js";
export const useEntitieConfigById = () => {
  const [entitiesById, setEntitiesById] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchEntitiesById = async id => {
    setLoading(true);
    try {
      const data = await entitiesService.getEntityById(id);
      setEntitiesById(data);
      return data;
    } catch (err) {
      ErrorHandler.generic(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  return {
    entitiesById,
    setEntitiesById,
    fetchEntitiesById,
    loading
  };
};