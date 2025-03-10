import { appointmentTypeService } from "../../../services/api/index.js";
export const userAvailabilityFormAppointmentTypesSelect = {
  selectId: 'userAvailabilityFormAppointmentTypeId',
  promise: appointmentTypeService.active(),
  mapper: data => {
    return data.map(item => {
      return {
        label: item.name,
        value: item.id
      };
    });
  },
  label: 'Tipo de cita',
  required: true,
  multiple: false,
  name: 'appointment_type_id'
};