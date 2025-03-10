import { genders } from "../../services/commons.js";
import { objectToArray } from "../../services/utilidades.js";
export const userFormGendersSelect = {
  selectId: 'userFormGender',
  data: objectToArray(genders),
  mapper: data => {
    return data.map(item => {
      return {
        label: item.name,
        value: item.id
      };
    });
  },
  label: 'Genero',
  required: true,
  multiple: false,
  name: 'gender'
};