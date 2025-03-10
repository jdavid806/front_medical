import { patientService } from "../../../services/api/index.js";
export const patientsSelect = {
  selectId: "patientId",
  promise: patientService.getAll(),
  mapper: data => {
    return data.map(item => {
      return {
        label: item.last_name + " " + item.middle_name,
        value: item.id
      };
    });
  },
  label: "Pacientes",
  required: true,
  multiple: false
};