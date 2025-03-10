import { daysOfWeek } from "../../services/commons.js";
import { objectToArray } from "../../services/utilidades.js";
export const userAvailabilityFormDaysSelect = {
  selectId: 'userAvailabilityFormDays',
  data: objectToArray(daysOfWeek),
  mapper: data => {
    return data.map((item, index) => {
      return {
        label: item,
        value: index.toString()
      };
    });
  },
  label: 'Días de la semana',
  required: true,
  multiple: true,
  name: 'days_of_week'
};