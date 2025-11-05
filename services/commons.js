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
    INDETERMINATE: 'Indeterminado',
    OTHER: 'Otro'
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

export const appointmentStateFilters = {
    'non-attendance': 'Sin atención',
    'pending': 'Pendiente',
    'pending_consultation': 'En espera',
    'called': 'Llamado',
    'in_consultation': 'En proceso',
    'consultation_completed': 'Finalizada',
    'cancelled': 'Cancelada',
    'rescheduled': 'Reprogramada'
}

export const appointmentStatesByKey = {
    'pending': 'Pendiente',
    'pending_consultation': 'En espera de consulta',
    'pending_consultation.PROCEDURE': 'En espera de examen',
    'called': 'Llamado',
    'in_consultation': 'En consulta',
    'consultation_completed': 'Consulta finalizada',
    'cancelled': 'Cancelada',
    'rescheduled': 'Reprogramada'
}

export const appointmentStatesByKeyTwo = {
    "pending": "Pendiente",
    "pending_consultation": {
        "CONSULTATION": "En espera de consulta",
        "PROCEDURE": "En espera de examen"
    },
    'called': 'Llamado',
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

export const appointmentStateColorsByKey = {
    'pending': 'warning',
    'pending_consultation': 'info',
    'called': 'info',
    'in_consultation': 'primary',
    'consultation_completed': 'success',
    'cancelled': 'danger',
    'rescheduled': 'secondary'
}

export const examTypes = {
    'LABORATORY': 'Laboratorio',
    'IMAGING': 'Imagenología',
}

export const examOrderStates = {
    'generated': 'Pendientes',
    'uploaded': 'Cargados'
}

export const examOrderStateColors = {
    'generated': 'warning',
    'uploaded': 'success'
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

export const examRecipeStatus = {
    'pending': 'Pendientes',
    'canceled': 'Cancelado',
    'uploaded': 'Cargados',
}

export const examRecipeStatusColors = {
    'pending': 'warning',
    'canceled': 'danger',
    'uploaded': 'success'
}

export const auditLogActions = {
    'created': 'Creado',
    'updated': 'Modificado',
    'deleted': 'Eliminado'
}

export const clinicalRecordStates = {
    'active': 'Activa',
    'pending_cancellation': 'Solicitud de cancelación pendiente',
    'pending_review': 'Pendiente de revision',
    'cancelled': 'Anulada'
}

export const clinicalRecordStateColors = {
    'active': 'success',
    'pending_cancellation': 'warning',
    'pending_review': 'warning',
    'cancelled': 'danger'
}

export const recipeInvoiceStates = {
    'pending': 'Facturada',
    'paid': 'Sin facturar'
}

export const recipeInvoiceStateColors = {
    'pending': 'success',
    'paid': 'warning'
}

export const generalRequestStates = {
    'pending': 'Pendiente',
    'approved': 'Aprobado',
    'rejected': 'Rechazado'
}

export const generalRequestStateColors = {
    'pending': 'warning',
    'approved': 'success',
    'rejected': 'danger'
}

export const statusInvoices = {
    partially_pending: 'Parcialmente pendiente',
    paid: 'Paga',
    cancelled: 'Anulada',
    pending: 'Pendiente',
}
