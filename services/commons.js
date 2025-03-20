export const rips = {
    CONSULTATION: 'Consulta',
    PROCEDURE: 'Procedimiento'
}

export const purposeConsultations = {
    PROMOTION: 'Promoción',
    PREVENTION: 'Prevención',
    CONTROL: 'Control',
    TREATMENT: 'Tratamiento',
    REHABILITATION: 'Rehabilitación'
}

export const typeConsults = {
    CONTROL: 'Control',
    EMERGENCY: 'Urgencia',
    FIRST_TIME: 'Primera vez',
    FOLLOW_UP: 'Seguimiento'
}

export const externalCauses = {
    ACCIDENT: 'Accidente',
    OTHER: 'Otra',
    NOT_APPLICABLE: 'No aplica'
}

export const genders = {
    MALE: 'Masculino',
    FEMALE: 'Femenino',
    INDETERMINATE: 'Indeterminado'
}

export const ticketPriorities = {
    NONE: 'Ninguna',
    SENIOR: 'Adulto Mayor',
    PREGNANT: 'Embarazada',
    DISABILITY: 'Discapacidad',
    CHILDREN_BABY: 'Niño/Bebé'
}

export const ticketReasons = {
    ADMISSION_PRESCHEDULED: 'Admisión (Cita Programada)',
    CONSULTATION_GENERAL: 'Consulta General',
    SPECIALIST: 'Especialista',
    VACCINATION: 'Vacunación',
    LABORATORY: 'Laboratorio',
    OTHER: 'Otro'
}

export const ticketStatus = {
    PENDING: 'Pendiente',
    CALLED: 'Llamado',
    COMPLETED: 'Completado',
    MISSED: 'No Asistió'
}

export const ticketStatusColors = {
    PENDING: 'warning',
    CALLED: 'info',
    COMPLETED: 'success',
    MISSED: 'danger'
}

export const ticketStatusSteps = {
    PENDING: 1,
    CALLED: 2,
    COMPLETED: 3,
    MISSED: 4
}

export const daysOfWeek = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miercoles',
    'Jueves',
    'Viernes',
    'Sabado'
]

export const appointmentStates = {
    1: 'Pendiente',
    2: 'En espera de consulta',
    3: 'En consulta',
    4: 'Consulta finalizada',
    5: 'Cancelada'
}

export const appointmentStatesColors = {
    1: 'warning',
    2: 'info',
    3: 'primary',
    4: 'success',
    5: 'danger'
}

export const appointmentStatesByKey = {
    'pending': 'Pendiente',
    'pending_consultation': 'En espera de consulta',
    'pending_consultation.PROCEDURE': 'En espera de examen',
    'in_consultation': 'En consulta',
    'consultation_completed': 'Consulta finalizada',
    'cancelled': 'Cancelada',
    'rescheduled': 'Reprogramada'
}

export const appointmentStateColorsByKey = {
    'pending': 'warning',
    'pending_consultation': 'info',
    'in_consultation': 'primary',
    'consultation_completed': 'success',
    'cancelled': 'danger',
    'rescheduled': 'secondary'
}

export const examOrderStates = {
    'generated': 'Pendiente por cargar resultados',
    'uploaded': 'Resultados subidos'
}

export const examOrderStateColors = {
    'generated': 'warning',
    'uploaded': 'success'
}

export const clinicalRecordStates = {
    'cancellation_request_pending': 'Solicitud de cancelación pendiente',
    'cancellation_request_rejected': 'Solicitud de cancelación rechazada',
    'cancellation_request_approved': 'Solicitud de cancelación aprobada'
}

export const clinicalRecordStateColors = {
    'cancellation_request_pending': 'warning',
    'cancellation_request_rejected': 'danger',
    'cancellation_request_approved': 'info'
}

export const appointmentTypes = [
    {
        "id": '1',
        "name": "Presencial"
    },
    {
        "id": '2',
        "name": "Virtual"
    },
    {
        "id": '3',
        "name": "Domiciliaria"
    }
]

export const maritalStatus = {
    "SINGLE": "Soltero",
    "MARRIED": "Casado",
    "DIVORCED": "Divorciado",
    "WIDOWED": "Viudo"
}

export const bloodType = {
    "O_POSITIVE": "O Positivo",
    "O_NEGATIVE": "O Negativo",
    "A_POSITIVE": "A Positivo",
    "A_NEGATIVE": "A Negativo",
    "B_POSITIVE": "B Positivo",
    "B_NEGATIVE": "B Negativo",
    "AB_POSITIVE": "AB Positivo",
    "AB_NEGATIVE": "AB Negativo"
}