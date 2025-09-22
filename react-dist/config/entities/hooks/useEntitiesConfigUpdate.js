import { useState } from "react";
import { entitiesService } from "../../../../services/api/index.js";
import { SwalManager } from "../../../../services/alertManagerImported.js";
export const useEntitiesConfigUpdate = () => {
  const [loading, setLoading] = useState(false);
  const updateEntities = async (id, data) => {
    setLoading(true);
    try {
      const response = await entitiesService.updateEntity(id, data);
      return response;
    } catch (error) {
      console.error("Error updating entity:", error);

      // Manejar la estructura específica de errores de Laravel/backend
      let errorMessage = "Error al actualizar la entidad";
      if (error?.response?.data) {
        const errorData = error.response.data;

        // Si hay errores de validación con campos específicos
        if (errorData.errors) {
          // Extraer el primer error del primer campo
          const firstField = Object.keys(errorData.errors)[0];
          const firstError = errorData.errors[firstField]?.[0];
          errorMessage = firstError || errorData.message || errorMessage;
        } else {
          // Si no hay errors, usar message directamente
          errorMessage = errorData.message || errorMessage;
        }
      } else {
        errorMessage = error?.message || errorMessage;
      }

      // Mostrar error en SweetAlert pero NO lanzar excepción
      SwalManager.error(errorMessage);

      // Lanzar una excepción específica para que el componente sepa que hubo error
      // pero sin el mensaje (ya se mostró en SweetAlert)
      throw new Error("VALIDATION_ERROR");
    } finally {
      setLoading(false);
    }
  };
  return {
    loading,
    updateEntities
  };
};