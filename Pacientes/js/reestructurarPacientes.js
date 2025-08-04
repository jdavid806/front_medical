import { appointmentStateColorsByKey, appointmentStatesByKeyTwo } from '../../services/commons.js';

export function reestructurarPacientes(pacientes) {
    return pacientes.map(paciente => {

        if (!paciente.primeraCita) {
            return null;
        }

        const stateKey = paciente.primeraCita.appointment_state?.name?.toString();

        // Determinar el estado actual de la cita
        const estadoActual = (() => {

            const stateKey = paciente.primeraCita.appointment_state?.name?.toString();
            let attentionType = paciente.primeraCita.attention_type || 'CONSULTATION';

            if (attentionType === 'REHABILITATION') {
                attentionType = 'CONSULTATION';
            }

            if (!stateKey) {
                return "SIN CITA";
            }

            return appointmentStatesByKeyTwo[stateKey]?.[attentionType] || appointmentStatesByKeyTwo[stateKey] || "SIN CITA";
        })();

        const colorEstado = (() => appointmentStateColorsByKey[stateKey])();

        const estadoCita = paciente.primeraCita ? {
            stateId: paciente.primeraCita.appointment_state_id,
            stateKey: paciente.primeraCita.appointment_state?.name || null,
            attention_type: paciente.primeraCita.attention_type || null,
            estadoActual: estadoActual,
            colorEstado: colorEstado
        } : {
            stateId: null,
            stateKey: null,
            attention_type: null,
            estadoActual: estadoActual,
            colorEstado: colorEstado
        };

        return {
            ...paciente,
            appointment_state: estadoCita,
            cita: paciente.primeraCita
        };
    }).filter(Boolean);
}