import { appointmentStateColorsByKey } from '../../services/commons.js';

export function reestructurarPacientes(pacientes) {
    return pacientes.map(paciente => {

        if (!paciente.primeraCita) {
            return null;
        }

        const stateKey = paciente.primeraCita.appointment_state?.name?.toString();

        // Determinar el estado actual de la cita
        const estadoActual = (() => {
            const statesMap = {
                "pending": "Pendiente",
                "pending_consultation": {
                    "CONSULTATION": "En espera de consulta",
                    "PROCEDURE": "En espera de examen"
                },
                "in_consultation": {
                    "CONSULTATION": "En Consulta",
                    "PROCEDURE": "En Examen"
                },
                "consultation_completed": {
                    "CONSULTATION": "Consulta Finalizada",
                    "PROCEDURE": "Examen Finalizado"
                },
                "cancelled": "Cancelada",
                "rescheduled": "Reprogramada"
            };

            const stateKey = paciente.primeraCita.appointment_state?.name?.toString();
            const attentionType = paciente.primeraCita.attention_type;

            if (!stateKey) {
                return "SIN CITA";
            }

            return statesMap[stateKey]?.[attentionType] || statesMap[stateKey] || "SIN CITA";
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