import { useState, useEffect } from "react";
import { assetsService } from "../../../../services/api";
import { FixedAsset } from "../interfaces/FixedAssetsTableTypes";

export const useAssets = () => {
  const [assets, setAssets] = useState<FixedAsset[]>([]);

  const fetchAssets = async (paginationParams: any) => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const fiveDaysBack = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];
      const { per_page, page, search, ...filters } = paginationParams;
      // Aplicar filtros adicionales a los parámetros de paginación
      const params = {
        per_page,
        page,
        search,
        description: filters.name,
        category: filters.category,
        internal_code: filters.internal_code,
        status: filters.status,
        start_date: filters?.date_range?.length ? filters.date_range[0].toISOString().split("T")[0] : today,
        end_date: filters?.date_range?.length ? filters.date_range[1].toISOString().split("T")[0]: fiveDaysBack,
        createdAt: filters.date_range
          ?.filter((date: any) => !!date)
          .map((date: any) => date.toISOString().split("T")[0])
          .join(","),
      };

      const response = await assetsService.getAll(params);

      return {
        data: response.data.data || response.data, // Ajusta según la estructura de tu API
        total: response.data.total || response.data.count || 0,
      };
    } catch (error) {
      console.error("Error fetching cash recipes:", error);
      return {
        data: [],
        total: 0,
      };
    }
  };

  return { assets, fetchAssets };
};
