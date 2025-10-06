import { Menubar } from 'primereact/menubar';
import React from 'react';
import { navbarMenuStyle } from "./styles/navBarMegaMenu.js";
import { useMenuItems } from "./hooks/useMenuItems.js";
const NavbarHeader = () => {
  const menuItemsFromHook = useMenuItems();
  const staticItems = [{
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
      url: "citasControl",
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
      url: "homeTurnos",
      items: [{
        label: "Turnos",
        icon: "fa fa-check-square",
        url: "gestion-turnos"
      }, {
        label: "Sala de Espera",
        icon: "fas fa-chalkboard-teacher",
        url: "waiting-room"
      }, {
        label: "Solicitud de Turnos",
        icon: "fa fa-hourglass",
        url: "solicitud-turnos"
      }]
    }, {
      label: "Farmacia",
      icon: "fa-solid fa-shop",
      url: "homeFarmacia",
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
    }, {
      label: "Consultas",
      icon: "fa-solid fa-hospital",
      url: "ClinicalRecordReports"
    }]
  }, {
    label: "Administración",
    icon: "fa-solid fa-user-gear ml-2",
    items: [{
      label: "Marketing",
      icon: "fa-solid fa-folder-tree",
      url: "homeMarketing",
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
      url: "homeConfiguracion",
      items: [{
        label: "Configuración Empresa",
        icon: "fa-solid fa-sliders",
        url: "configuracionEmpresa"
      }, {
        label: "Entidades",
        icon: "fa-solid fa-user-tie",
        url: "configEntidades"
      }, {
        label: "Usuarios",
        icon: "fa-solid fa-users-line",
        url: "configUsuarios",
        items: [{
          label: "Usuarios",
          icon: "fa-solid fa-user-gear",
          url: "cardUsers"
        }, {
          label: "Roles de Usuario",
          icon: "fa-solid fa-users-gear",
          url: "cardRoles"
        }, {
          label: "Horarios de Atención",
          icon: "fa-solid fa-clock-rotate-left",
          url: "cardHorarios"
        }, {
          label: "Ausencias Programadas",
          icon: "fa-solid fa-business-time",
          url: "cardAusencias"
        }, {
          label: "Comisiones",
          icon: "fa-solid fa-magnifying-glass-dollar",
          url: "cardComisiones"
        }, {
          label: "Modulos",
          icon: "fa-solid fa-folder-open",
          url: "cardModulos"
        }, {
          label: "Especialidades Medicas",
          icon: "fa-solid fa-file-medical",
          url: "cardEspecialidades"
        }, {
          label: "Motivo de Consulta",
          icon: "fa-solid fa-user-nurse",
          url: "cardMotivoConsulta"
        }]
      }, {
        label: "Examenes",
        icon: "fa-solid fa-vials",
        url: "configExamenes"
      }, {
        label: "Precios",
        icon: "fa-solid fa-circle-dollar-to-slot",
        url: "configPrecios"
      }, {
        label: "Importaciones",
        icon: "fa-solid fa-upload",
        url: "configImportaciones"
      }, {
        label: "Consentimientos",
        icon: "fa-solid fa-cedi-sign",
        url: "configConsentimientos"
      }, {
        label: "Convenios",
        icon: "fa-solid fa-handshake-angle",
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
        icon: "fa-solid fa-pills",
        url: "inventarioMedicamentos"
      }, {
        label: "Vacunas",
        icon: "fa-solid fa-syringe",
        url: "inventarioVacunas"
      }]
    }, {
      label: "Auditoria",
      icon: "fa-solid fa-person-chalkboard",
      url: "homeAuditoria",
      items: [{
        label: "Anulaciones de historias clinicas",
        icon: "fa-solid fa-boxes-stacked",
        url: "consultas-anulacion-pendiente"
      }, {
        label: "Anulaciones de facturas",
        icon: "fa-solid fa-ban",
        url: "admisiones-anulacion-pendiente"
      }, {
        label: "Estados de las solicitudes",
        icon: "fa-solid fa-bars-progress",
        url: "general-requests"
      }, {
        label: "Logs",
        icon: "fa-solid fa-check",
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
      icon: "fa-solid fa-sack-dollar",
      items: [{
        label: "Facturaciónes",
        icon: "fa-solid fa-wallet",
        url: "FE_FCE"
      }, {
        label: "Recibos de Caja",
        icon: "fa-solid fa-receipt",
        url: "RecibosDeCajas"
      }, {
        label: "Cuentas x Cobrar y Pagar",
        icon: "fa-solid fa-scale-balanced",
        url: "CuentasCobrarPagar"
      }, {
        label: "Cierre de Caja",
        icon: "fa-solid fa-shop-slash",
        url: "controlCaja"
      }, {
        label: "Control Cierre de Caja",
        icon: "fa-solid fa-cash-register",
        url: "reporteCaja"
      }, {
        label: "Bancos",
        icon: "fa-solid fa-piggy-bank",
        url: "BancosContables"
      }]
    }, {
      label: "Contable",
      icon: "fa-solid fa-vault",
      url: "homeContabilidad",
      items: [{
        label: "Cuentas Contables",
        icon: "fa-solid fa-boxes-stacked",
        url: "CuentasContables"
      }, {
        label: "Comprobantes Contables",
        icon: "fa-solid fa-money-bill-transfer",
        url: "ComprobantesContables"
      }, {
        label: "Cierres Contables",
        icon: "fa-solid fa-shop-lock",
        url: "CierresContables"
      }, {
        label: "Auditoria Contable",
        icon: "fa-solid fa-magnifying-glass-dollar",
        url: "FE_ContabilidadNueva"
      }]
    }, {
      label: "Configuración Contable",
      icon: "fa-solid fa-toolbox",
      url: "configContabilidad",
      items: [{
        label: "Metodos de Pago",
        icon: "fa-solid fa-cart-shopping",
        url: "metodosPago"
      }, {
        label: "Impuestos",
        icon: "fa-solid fa-money-bill-trend-up",
        url: "impuestos"
      }, {
        label: "Retenciones",
        icon: "fa-solid fa-money-bill-transfer",
        url: "retenciones"
      }, {
        label: "Centros de Costo",
        icon: "fa-solid fa-money-check",
        url: "centroCosto"
      }, {
        label: "Facturacion",
        icon: "fa-solid fa-file-invoice-dollar",
        url: "facturacionConfiguracion"
      }]
    }, {
      label: "Gestión de Activos",
      icon: "fa-solid fa-chart-line",
      url: "ActivosFijos"
    }, {
      label: "Gestión de Terceros",
      icon: "fa-solid fa-users-viewfinder",
      url: "GestionarTerceros"
    }]
  }];
  ;

  // Usar menús del backend si existen, sino usar menú estático
  const finalItems = menuItemsFromHook.length > 0 ? menuItemsFromHook : staticItems;
  const iconTemplate = iconClass => {
    return /*#__PURE__*/React.createElement("i", {
      className: iconClass
    });
  };
  const processItems = items => {
    return items.map(item => {
      const processedItem = {
        ...item
      };
      if (item.icon) {
        processedItem.icon = () => iconTemplate(item.icon);
      }
      if (item.items) {
        processedItem.items = processItems(item.items);
      }
      return processedItem;
    });
  };
  const processedItems = processItems(finalItems);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Menubar, {
    model: processedItems,
    className: "custom-responsive-megamenu"
  }), /*#__PURE__*/React.createElement("style", null, navbarMenuStyle));
};
export default NavbarHeader;