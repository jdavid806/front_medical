import { patientService } from "../../../services/api";
import { CustomSelectContainerConfig } from "../../components/CustomSelectContainer";

export const patientsSelect: CustomSelectContainerConfig = {
  selectId: "patientId",
  promise: patientService.getAll(),
  mapper: (data: any[]) => {
    return data.map((item) => {
      return {
        label: item.last_name + " " + item.middle_name,
        value: item.id,
      };
    });
  },
  label: "Pacientes",
  required: true,
  multiple: false,
};
