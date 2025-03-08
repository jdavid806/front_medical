import { appointmentService } from "../../../services/api/index.js";

export default function appointmentHandler() {
    return {
        appointments: [],

        async fetchAppointments(patientId) {
            let data = await appointmentService.getAll()

            this.appointments = data.filter(appointment => appointment.patient_id == patientId)
        },

        deleteAppointment(id) {
            Swal.fire({
                title: '¿Estás seguro?',
                text: "No podrás revertir esto.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.appointments = this.appointments.filter(appointment => appointment.id !== id);
                    Swal.fire('¡Eliminado!', 'La cita ha sido eliminada.', 'success');
                }
            });
        }
    };
}