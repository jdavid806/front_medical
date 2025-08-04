import { CreateCostCenterDTO, UpdateCostCenterDTO } from "../interfaces/CostCenterDTO";
import { CostCenterFormInputs } from "../interfaces/CostCenterFormConfigType";

export const CostCentersMapperCreate = (data: CostCenterFormInputs): CreateCostCenterDTO => {
  if (!data.code) {
    throw new Error("El código del centro de costo es requerido");
  }

  if (!data.name) {
    throw new Error("El nombre del centro de costo es requerido");
  }

  return {
    name: data.name,
    code: data.code,
    description: data.description || undefined 
  };
};

export const CostCentersMapperUpdate = (data: CostCenterFormInputs): UpdateCostCenterDTO => {
  if (!data.id) {
    throw new Error("Se requiere el ID para actualizar un centro de costo");
  }

  return {
    name: data.name,
    code: data.code,
    description: data.description || undefined
  };
};