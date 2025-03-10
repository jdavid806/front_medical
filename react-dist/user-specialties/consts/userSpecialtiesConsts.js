import { userSpecialtyService } from "../../../services/api/index.js";
export const userFormSpecialtiesSelect = {
  selectId: 'userFormSpecialtyId',
  promise: userSpecialtyService.getAll(),
  mapper: data => {
    return data.map(item => {
      return {
        label: item.name,
        value: item.id
      };
    });
  },
  label: 'Especialidad',
  required: true,
  multiple: false
};