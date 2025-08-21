import { useProductsByType } from "../../products/hooks/useProductsByType.js";
export const useAppointmentProcedures = () => {
  const {
    productsByType: procedures,
    fetchProductsByType
  } = useProductsByType();
  const loadProcedures = async () => {
    try {
      await fetchProductsByType("Servicios");
    } catch (error) {
      console.error("Error al cargar procedimientos:", error);
      throw error;
    }
  };
  const procedureOptions = procedures.map(procedure => ({
    label: procedure.name || procedure.description || `Procedimiento ${procedure.id}`,
    value: procedure,
    code: procedure.barcode,
    price: procedure.sale_price,
    tax: procedure.tax_charge?.percentage || 0
  }));
  return {
    procedures,
    loadProcedures,
    procedureOptions
  };
};