// src/hooks/useAssetCategories.ts
import { useState, useEffect } from "react";
import { resourcesAdminService } from "../../../../services/api/index.js";
export const useAssetCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await resourcesAdminService.getAssetCategories();

        // Transformar la respuesta del API al formato para Dropdown
        const formattedCategories = response.data.map(category => ({
          label: category.attributes.name,
          value: category.id.toString(),
          description: category.attributes.description
        }));
        setCategories(formattedCategories);
      } catch (err) {
        console.error("Error fetching asset categories:", err);
        setError(err instanceof Error ? err : new Error("Error al cargar categorías"));
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);
  return {
    categories,
    loading,
    error
  };
};