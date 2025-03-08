import 'https://cdnjs.cloudflare.com/ajax/libs/list.js/2.3.1/list.min.js';
import { appointmentService } from "./api/index.js";

export const appointmentsBulkTable = async (elementId) => {
    const appointments = await appointmentService.getAll()
    const mappedAppointments = appointments.map(appointment => {
        return appointment
    })
    var options = {
        valueNames: ['name', 'born']
    };
    var bulkTable = new List(
        elementId,
        options,
        mappedAppointments
    );
}