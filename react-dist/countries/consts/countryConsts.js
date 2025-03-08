import { countryService } from "../../../services/api/index.js";
export const userFormCountriesSelect = {
  selectId: 'userFormCountryId',
  promise: countryService.getAll(),
  mapper: data => {
    return data.map(item => {
      return {
        label: item.name,
        value: item.id
      };
    });
  },
  label: 'País',
  required: true,
  multiple: false,
  name: 'country_id'
};