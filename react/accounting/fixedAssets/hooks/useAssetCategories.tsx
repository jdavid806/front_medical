// hooks/useAssetCategories.ts
import { useState, useEffect } from "react";
import { ResourcesAdminService } from "../../../../services/api/classes/resourcesAdmin";

export const useAssetCategories = () => {
  const [categories, setCategories] = useState<
    { label: string; value: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const service = new ResourcesAdminService();
        const response = await service.getAssetCategories();

        console.log("response: ", response);
        // Transformar la respuesta del API al formato que necesita el Dropdown
        const formattedCategories = response.data.map((category: any) => ({
          label: category.name,
          value: category.id.toString(),
        }));

        setCategories(formattedCategories);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Error al cargar categorías")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};
