import { useState } from "react";
import { assetsService } from "../../../../services/api/index.js";
export const useAssets = () => {
  const [assets, setAssets] = useState([]);
  const fetchAssets = async paginationParams => {
    console.log("Fetching cash recipes...", paginationParams);
    try {
      const {
        per_page,
        page,
        search,
        ...filters
      } = paginationParams;
      // Aplicar filtros adicionales a los parámetros de paginación
      const params = {
        per_page,
        page,
        search,
        description: filters.name,
        category: filters.category,
        internal_code: filters.internal_code,
        status: filters.status,
        createdAt: filters.date_range?.filter(date => !!date).map(date => date.toISOString().split("T")[0]).join(",")
      };
      console.log("params", params);
      const response = await assetsService.getAll(params);
      return {
        data: response.data.data || response.data,
        // Ajusta según la estructura de tu API
        total: response.data.total || response.data.count || 0
      };
    } catch (error) {
      console.error("Error fetching cash recipes:", error);
      return {
        data: [],
        total: 0
      };
    }
  };
  return {
    assets,
    fetchAssets
  };
};