import { countryService } from "../../../services/api/index.js";
export const CountriesSelectConfig = {
  mapper: data => {
    return data.map(item => {
      return {
        label: item.name,
        value: item.id
      };
    });
  },
  label: 'País',
  multiple: false,
  promise: countryService.getAll(),
  required: true
};