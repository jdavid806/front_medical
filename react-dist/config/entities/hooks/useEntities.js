import { useState, useEffect } from "react";
import { entityService } from "../../../../services/api/index.js";
const useEntities = () => {
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const loadEntities = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await entityService.getAll();
      const entityOptions = response.data.map(e => ({
        label: e.name,
        value: e.id.toString()
      }));
      setEntities(entityOptions);
      return entityOptions;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error al cargar entidades";
      setError(errorMessage);
      console.error("Error loading entities:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };
  const getEntityName = entityId => {
    const entity = entities.find(e => e.value === entityId);
    return entity?.label || "";
  };
  const getEntityId = entityName => {
    const entity = entities.find(e => e.label === entityName);
    return entity?.value || "";
  };
  useEffect(() => {
    loadEntities();
  }, []);
  return {
    entities,
    loading,
    error,
    loadEntities,
    getEntityName,
    getEntityId
  };
};
export default useEntities;