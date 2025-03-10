import { cityService } from "../../../services/api/index.js";
export const userFormCitiesSelect = {
  selectId: 'userFormCityId',
  promise: cityService.getAll(),
  mapper: data => {
    return data.map(item => {
      return {
        label: item.name,
        value: item.id
      };
    });
  },
  label: 'Ciudad',
  required: true,
  multiple: false,
  name: 'city_id'
};