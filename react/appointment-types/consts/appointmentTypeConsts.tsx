import { appointmentTypeService } from "../../../services/api";
import { CustomSelectContainerConfig } from "../../components/CustomSelectContainer";
import { AppointmentTypeDto } from "../../models/models";

export const userAvailabilityFormAppointmentTypesSelect: CustomSelectContainerConfig = {
    selectId: 'userAvailabilityFormAppointmentTypeId',
    promise: appointmentTypeService.active(),
    mapper: (data: AppointmentTypeDto[]) => {
        return data.map(item => {
            return {
                label: item.name,
                value: item.id
            }
        })
    },
    label: 'Tipo de cita',
    required: true,
    multiple: false,
    name: 'appointment_type_id'
}