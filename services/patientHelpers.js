export function getPatientNextAppointment(patient) {
    const hoy = new Date().toISOString().split('T')[0];

    const citasHoy = patient.appointments
        .filter(c => c.appointment_date === hoy)
        .sort((a, b) => {
            const fechaHoraA = new Date(`${a.appointment_date}T${a.appointment_time}`);
            const fechaHoraB = new Date(`${b.appointment_date}T${b.appointment_time}`);
            return fechaHoraA - fechaHoraB;
        });

    let citaAMostrar;

    if (citasHoy.length === 1) {
        citaAMostrar = citasHoy[0];
    } else {
        citaAMostrar = citasHoy.find(c => !["consultation_completed", "cancelled"].includes(c.appointment_state.name));
    }

    if (!citaAMostrar && citasHoy.length > 0) {
        citaAMostrar = citasHoy[citasHoy.length - 1];
    }

    return citaAMostrar || null;
}