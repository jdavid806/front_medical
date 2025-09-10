export const items = [{
  label: "Home",
  icon: "fa-solid fa-house",
  items: [{
    label: "Inicio",
    icon: "fa-solid fa-house",
    url: "Dashboard"
  }, {
    label: "Consultas",
    icon: "fa-solid fa-magnifying-glass",
    url: "pacientes"
  }, {
    label: "Admisiones",
    icon: "fa-solid fa-bookmark",
    items: [{
      label: "Facturación",
      icon: "fas fa-file-invoice-dollar",
      url: "facturacionAdmisiones"
    }, {
      label: "Pacientes",
      icon: "fa-solid fa-stethoscope",
      url: "pacientescontrol"
    }, {
      label: "Citas",
      icon: "fa-solid fa-calendar-days",
      url: "gestioncitas"
    }, {
      label: "Sala de Espera",
      icon: "fas fa-hospital",
      url: "salaEspera"
    }, {
      label: "Post-Consulta",
      icon: "fa-solid fa-file-contract",
      url: "postconsultaControl"
    }, {
      label: "Admisiones",
      icon: "fa-solid fa-house-medical",
      url: "controlAdmisiones"
    }]
  }, {
    label: "Telemedicina",
    icon: "fa-solid fa-stethoscope",
    url: "telemedicina"
  }, {
    label: "Turnos",
    icon: "fa-solid fa-ticket",
    url: "homeTurnos"
  }, {
    label: "Farmacia",
    icon: "fa-solid fa-shop",
    items: [{
      label: "Entrega de medicamentos",
      icon: "fa-solid fa-user-injured",
      url: "farmacia"
    }, {
      label: "Entrega de insumos",
      icon: "fa-solid fa-stethoscope",
      url: "insumos"
    }, {
      label: "Solicitud de insumos",
      icon: "fa-solid fa-capsules",
      url: "solicitarInsumos"
    }, {
      label: "Caja",
      icon: "fa-solid fa-tablets",
      url: "salaEspera"
    }, {
      label: "Facturas - Farmacia",
      icon: "fa-solid fa-hand-holding-dollar",
      url: "pharmacyInvoices"
    }]
  }, {
    label: "Laboratorio",
    icon: "fa-solid fa-flask-vial",
    url: "verOrdenesExamenesGenerales"
  }]
}, {
  label: "Reportes",
  icon: "fa-solid fa-file-signature",
  items: [{
    label: "Facturación",
    icon: "fa-solid fa-money-bill",
    url: "Invoices"
  }, {
    label: "Facturas x Entidad",
    icon: "fa-solid fa-money-bill-wave",
    url: "InvoicesByEntity"
  }, {
    label: "Especialistas",
    icon: "fa-solid fa-user-doctor",
    url: "InvoicesDoctors"
  }, {
    label: "Bonificaciones",
    icon: "fa-solid fa-money-bill-trend-up",
    url: "Commissions"
  }, {
    label: "Citas",
    icon: "fa-solid fa-calendar-week",
    url: "AppointmentsReport"
  }]
}, {
  label: "Administración",
  icon: "fa-solid fa-user-gear ml-2",
  items: [{
    label: "Marketing",
    icon: "fa-solid fa-folder-tree",
    items: [{
      label: "Mensajeria masiva",
      icon: "fa-solid fa-message",
      url: "MassMessage"
    }, {
      label: "Plantillas de mensajes",
      icon: "fa-solid fa-square-envelope",
      url: "plantillasMensajes"
    }, {
      label: "Encuestas",
      icon: "fa-solid fa-square-poll-vertical",
      url: "panel-encuesta"
    }]
  }, {
    label: "Configuración",
    icon: "fa-solid fa-wrench",
    items: [{
      label: "Configuración Empresa",
      icon: "fa-solid fa-sliders",
      url: "configuracionEmpresa"
    }, {
      label: "Entidades",
      icon: "fa-solid fa-lock",
      url: "configEntidades"
    }, {
      label: "Usuarios",
      icon: "fa-solid fa-lock",
      items: [{
        label: "Usuarios",
        icon: "fa-solid fa-lock",
        url: "cardUsers"
      }, {
        label: "Roles de Usuario",
        icon: "fa-solid fa-lock",
        url: "cardRoles"
      }, {
        label: "Horarios de Atención",
        icon: "fa-solid fa-lock",
        url: "cardHorarios"
      }, {
        label: "Ausencias Programadas",
        icon: "fa-solid fa-lock",
        url: "cardAusencias"
      }, {
        label: "Comisiones",
        icon: "fa-solid fa-lock",
        url: "cardComisiones"
      }, {
        label: "Modulos",
        icon: "fa-solid fa-lock",
        url: "cardModulos"
      }, {
        label: "Modulos",
        icon: "fa-solid fa-lock",
        url: "cardModulos"
      }, {
        label: "Especialidades Medicas",
        icon: "fa-solid fa-lock",
        url: "cardEspecialidades"
      }, {
        label: "Motivo de Consulta",
        icon: "fa-solid fa-lock",
        url: "cardMotivoConsulta"
      }]
    }, {
      label: "Examenes",
      icon: "fa-solid fa-lock",
      url: "configExamenes"
    }, {
      label: "Precios",
      icon: "fa-solid fa-lock"
    }, {
      label: "Importaciones",
      icon: "fa-solid fa-lock",
      url: "configImportaciones"
    }, {
      label: "Consentimientos",
      icon: "fa-solid fa-lock",
      url: "configConsentimientos"
    }, {
      label: "Convenios",
      icon: "fa-solid fa-lock",
      url: "configTenantConvenios"
    }]
  }, {
    label: "Inventario",
    icon: "fa-solid fa-truck-ramp-box",
    url: "homeInventario",
    items: [{
      label: "Productos Inventariables",
      icon: "fa-solid fa-boxes-stacked",
      url: "inventarioInventariables"
    }, {
      label: "Medicamentos",
      icon: "fa-solid fa-truck",
      url: "inventarioMedicamentos"
    }, {
      label: "Vacunas",
      icon: "fa-solid fa-truck",
      url: "inventarioVacunas"
    }]
  }, {
    label: "Auditoria",
    icon: "fa-solid fa-person-chalkboard",
    items: [{
      label: "Anulaciones de historias clinicas",
      icon: "fa-solid fa-boxes-stacked",
      url: "consultas-anulacion-pendiente"
    }, {
      label: "Anulaciones de facturas",
      icon: "fa-solid fa-truck",
      url: "admisiones-anulacion-pendiente"
    }, {
      label: "Estados de las solicitudes",
      icon: "fa-solid fa-truck",
      url: "general-requests"
    }, {
      label: "Logs",
      icon: "fa-solid fa-truck",
      url: "logsAuditoria"
    }]
  }, {
    label: "Comunidad",
    icon: "fa-solid fa-people-roof",
    url: "social"
  }, {
    label: "Manual De Usuario",
    icon: "fa-solid fa-book-open",
    url: "manualUsuario"
  }]
}, {
  label: "Contabilidad",
  icon: "fa-solid fa-money-check-dollar",
  items: [{
    label: "Facturacion",
    icon: "fa-solid fa-boxes-stacked",
    items: [{
      label: "Facturaciónes",
      icon: "fa-solid fa-truck",
      url: "FE_FCE"
    }, {
      label: "Recibos de Caja",
      icon: "fa-solid fa-truck",
      url: "RecibosDeCajas"
    }, {
      label: "Cuentas x Cobrar y Pagar",
      icon: "fa-solid fa-truck",
      url: "CuentasCobrarPagar"
    }, {
      label: "Cierre de Caja",
      icon: "fa-solid fa-truck",
      url: "controlCaja"
    }, {
      label: "Control Cierre de Caja",
      icon: "fa-solid fa-truck",
      url: "reporteCaja"
    }, {
      label: "Bancos",
      icon: "fa-solid fa-truck",
      url: "BancosContables"
    }]
  }, {
    label: "Contable",
    icon: "fa-solid fa-boxes-stacked",
    items: [{
      label: "Cuentas Contables",
      icon: "fa-solid fa-boxes-stacked",
      url: "CuentasContables"
    }, {
      label: "Comprobantes Contables",
      icon: "fa-solid fa-truck",
      url: "ComprobantesContables"
    }, {
      label: "Cierres Contables",
      icon: "fa-solid fa-truck",
      url: "CierresContables"
    }, {
      label: "Auditoria Contable",
      icon: "fa-solid fa-truck",
      url: "FE_ContabilidadNueva"
    }]
  }, {
    label: "Configuración Contable",
    icon: "fa-solid fa-truck",
    items: [{
      label: "Metodos de Pago",
      icon: "fa-solid fa-boxes-stacked",
      url: "metodosPago"
    }, {
      label: "Impuestos",
      icon: "fa-solid fa-truck",
      url: "impuestos"
    }, {
      label: "Retenciones",
      icon: "fa-solid fa-truck",
      url: "retenciones"
    }, {
      label: "Centros de Costo",
      icon: "fa-solid fa-truck",
      url: "centroCosto"
    }, {
      label: "Facturacion",
      icon: "fa-solid fa-truck",
      url: "facturacionConfiguracion"
    }]
  }, {
    label: "Gestión de Activos",
    icon: "fa-solid fa-truck",
    url: "ActivosFijos"
  }, {
    label: "Gestión de Terceros",
    icon: "fa-solid fa-truck",
    url: "GestionarTerceros"
  }]
}];