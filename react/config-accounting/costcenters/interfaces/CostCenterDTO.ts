// interfaces/CostCentersConfigDTO.ts
export interface CostCenterFormInputs {
  id?: string;
  name: string;
  code: string;
  description: string;
}

export interface CostCenterDTO {
  id: string;
  name: string;
  code: string;
  description: string | null;
}

export interface CreateCostCenterDTO {
  name: string;
  code: string;
  description?: string;
}

export interface UpdateCostCenterDTO {
  name?: string;
  code?: string;
  description?: string;
}