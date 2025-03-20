 export function reestructurarPacientes(pacientes) {
    return pacientes.map(paciente => {
        // Extraer la primera cita si existe
        const primeraCita = paciente.appointments[0];

        // Determinar el estado actual de la cita
        const estadoActual = (() => {
            if (!primeraCita) return "SIN CITA"; // Si no hay citas

            const stateId = primeraCita.appointment_state_id?.toString();
            const stateKey = primeraCita.appointment_state?.id?.toString();
            const attentionType = primeraCita.attention_type;

            if (!stateId || !stateKey || !attentionType) {
                console.warn("Faltan propiedades requeridas en el objeto 'appointment'.", primeraCita);
                return "SIN CITA";
            }

            // Lógica para determinar el estado
            if (stateId === "1" || (stateKey === "pending" && attentionType === "PROCEDURE")) {
                return "Pendiente";
            }
            if ((stateId === "2" || stateKey === "pending_consultation" || stateKey === "in_consultation") && attentionType === "CONSULTATION") {
                return "En espera de consulta";
            }
            if ((stateId === "2" || stateKey === "pending_consultation") && attentionType === "PROCEDURE") {
                return "En espera de examen";
            }
            if (stateId === "8" || (stateKey === "consultation_completed" && attentionType === "CONSULTATION")) {
                return "Consulta Finalizada";
            }
            if (stateId === "7" || (stateKey === "in_consultation" && attentionType === "CONSULTATION")) {
                return "En Consulta";
            }
            return "SIN CITA"; // Estado por defecto
        })();

        // Asignar un color según el estado actual
        const colorEstado = (() => {
            switch (estadoActual) {
                case "Pendiente":
                    return "#FFA500"; // Naranja
                case "En espera de consulta":
                    return "#FFFF00"; // Amarillo
                case "En espera de examen":
                    return "#007bff"; // azul
                case "Consulta Finalizada":
                    return "#FFA500"; // Verde
                case "En Consulta":
                    return "#0000FF"; // Azul
                default:
                    return "#808080"; // Gris (Desconocido)
            }
        })();

        // Crear el objeto appointment_state
        const estadoCita = primeraCita ? {
            stateId: primeraCita.appointment_state_id,
            stateKey: primeraCita.appointment_state?.name || null,
            attention_type: primeraCita.attention_type || null,
            estadoActual: estadoActual,
            colorEstado: colorEstado // Nuevo campo para el color
        } : {
            stateId: null,
            stateKey: null,
            attention_type: null,
            estadoActual: estadoActual,
            colorEstado: colorEstado // Nuevo campo para el color
        };

        // Retornar el paciente con el nuevo campo appointment_state
        return {
            ...paciente,
            appointment_state: estadoCita
        };
    });
}