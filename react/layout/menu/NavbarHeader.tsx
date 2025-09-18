import { Menubar } from 'primereact/menubar';
import React from 'react';

const NavbarHeader = () => {
    const items = [
        {
            label: 'Home',
            icon: 'fa-solid fa-house',
            items: [
                {
                    label: 'Inicio',
                    icon: 'fa-solid fa-house',
                    url: 'Dashboard'
                },

                {
                    label: 'Consultas',
                    icon: 'fa-solid fa-magnifying-glass',
                    url: 'pacientes',
                },

                {
                    label: 'Admisiones',
                    icon: 'fa-solid fa-bookmark',
                    items: [
                        { label: 'Facturación', icon: 'fas fa-file-invoice-dollar', url: 'facturacionAdmisiones' },
                        { label: 'Pacientes', icon: 'fa-solid fa-stethoscope', url: 'pacientescontrol' },
                        { label: 'Citas', icon: 'fa-solid fa-calendar-days', url: 'gestioncitas' },
                        { label: 'Sala de Espera', icon: 'fas fa-hospital', url: 'salaEspera' },
                        { label: 'Post-Consulta', icon: 'fa-solid fa-file-contract', url: 'postconsultaControl' },
                        { label: 'Admisiones', icon: 'fa-solid fa-house-medical', url: 'controlAdmisiones' },
                    ]
                },
                { label: 'Telemedicina', icon: 'fa-solid fa-stethoscope', url: 'telemedicina' },
                { label: 'Turnos', icon: 'fa-solid fa-ticket', url: 'homeTurnos' },
                {
                    label: 'Farmacia',
                    icon: 'fa-solid fa-shop',
                    items: [

                        {
                            label: 'Entrega de medicamentos',
                            icon: 'fa-solid fa-user-injured',
                            url: 'farmacia',
                        },

                        {
                            label: 'Entrega de insumos',
                            icon: 'fa-solid fa-stethoscope',
                            url: 'insumos'
                        },
                        {
                            label: 'Solicitud de insumos',
                            icon: 'fa-solid fa-capsules',
                            url: 'solicitarInsumos'
                        },
                        {
                            label: 'Caja',
                            icon: 'fa-solid fa-tablets',
                            url: 'salaEspera'
                        },

                        {
                            label: 'Facturas - Farmacia',
                            icon: 'fa-solid fa-hand-holding-dollar',
                            url: 'pharmacyInvoices'
                        },
                    ]

                },
                {
                    label: 'Laboratorio',
                    icon: 'fa-solid fa-flask-vial',
                    url: 'verOrdenesExamenesGenerales'
                }

            ]
        },
        {
            label: 'Reportes',
            icon: 'fa-solid fa-file-signature',
            items: [
                {
                    label: 'Facturación',
                    icon: 'fa-solid fa-money-bill',
                    url: 'Invoices',
                },
                {
                    label: 'Facturas x Entidad',
                    icon: 'fa-solid fa-money-bill-wave',
                    url: 'InvoicesByEntity',

                },
                {
                    label: 'Especialistas',
                    icon: 'fa-solid fa-user-doctor',
                    url: 'InvoicesDoctors',
                },
                { label: 'Bonificaciones', icon: 'fa-solid fa-money-bill-trend-up', url: 'Commissions' },
                { label: 'Citas', icon: 'fa-solid fa-calendar-week', url: 'AppointmentsReport' }


            ]
        },
        {
            label: 'Administración',
            icon: 'fa-solid fa-user-gear ml-2',
            items: [

                {
                    label: 'Marketing',
                    icon: 'fa-solid fa-folder-tree',
                    items: [
                        {
                            label: 'Mensajeria masiva',
                            icon: 'fa-solid fa-message',
                            url: 'MassMessage'
                        },
                        {
                            label: 'Plantillas de mensajes',
                            icon: 'fa-solid fa-square-envelope',
                            url: 'plantillasMensajes'
                        },

                        {
                            label: 'Encuestas',
                            icon: 'fa-solid fa-square-poll-vertical',
                            url: 'panel-encuesta'
                        }
                    ]
                },
                {
                    label: 'Configuración',
                    icon: 'fa-solid fa-wrench',
                    items: [
                        {
                            label: 'Configuración Empresa',
                            icon: 'fa-solid fa-sliders',
                            url: 'configuracionEmpresa'
                        },

                        {
                            label: 'Entidades',
                            icon: 'fa-solid fa-house-medical-flag',
                            url: 'configEntidades'
                        },

                        {
                            label: 'Usuarios',
                            icon: 'fa-solid fa-hospital-user',
                            items: [
                                {
                                    label: 'Usuarios',
                                    icon: 'fa-solid fa-hospital-user',
                                    url: 'cardUsers'
                                },

                                {
                                    label: 'Roles de Usuario',
                                    icon: 'fa-solid fa-users-gear',
                                    url: 'cardRoles'
                                },

                                {
                                    label: 'Horarios de Atención',
                                    icon: 'fa-solid fa-user-clock',
                                    url: 'cardHorarios'
                                },

                                {
                                    label: 'Ausencias Programadas',
                                    icon: 'fa-solid fa-user-check',
                                    url: 'cardAusencias'
                                },

                                {
                                    label: 'Comisiones',
                                    icon: 'fa-solid fa-dollar-sign',
                                    url: 'cardComisiones'
                                },

                                {
                                    label: 'Modulos',
                                    icon: 'fa-solid fa-folder-open',
                                    url: 'cardModulos'
                                },

                                {
                                    label: 'Especialidades Medicas',
                                    icon: 'fa-solid fa-folder-plus',
                                    url: 'cardEspecialidades'
                                },

                                {
                                    label: 'Motivo de Consulta',
                                    icon: 'fa-solid fa-magnifying-glass-plus',
                                    url: 'cardMotivoConsulta'
                                },
                            ]
                        },

                        {
                            label: 'Examenes',
                            icon: 'fa-solid fa-microscope',
                            url: 'configExamenes'
                        },

                        {
                            label: 'Precios',
                            icon: 'fa-solid fa-money-bills',

                        },

                        {
                            label: 'Importaciones',
                            icon: 'fa-solid fa-cloud-arrow-up',
                            url: 'configImportaciones'
                        },

                        {
                            label: 'Consentimientos',
                            icon: 'fa-solid fa-copyright',
                            url: 'configConsentimientos'
                        },


                        {
                            label: 'Convenios',
                            icon: 'fa-solid fa-hands-holding',
                            url: 'configTenantConvenios'
                        },


                    ]
                },
                {
                    label: 'Inventario',
                    icon: 'fa-solid fa-truck-ramp-box',
                    url: 'homeInventario',
                    items: [
                        {
                            label: 'Productos Inventariables',
                            icon: 'fa-solid fa-boxes-stacked',
                            url: 'inventarioInventariables'
                        },

                        {
                            label: 'Medicamentos',
                            icon: 'fa-solid fa-truck',
                            url: 'inventarioMedicamentos'
                        },

                        {
                            label: 'Vacunas',
                            icon: 'fa-solid fa-syringe',
                            url: 'inventarioVacunas'
                        }
                    ]
                },

                {
                    label: 'Auditoria',
                    icon: 'fa-solid fa-person-chalkboard',
                    items: [
                        {
                            label: 'Anulaciones de historias clinicas',
                            icon: 'fa-solid fa-boxes-stacked',
                            url: 'consultas-anulacion-pendiente'
                        },

                        {
                            label: 'Anulaciones de facturas',
                            icon: 'fa-solid fa-truck',
                            url: 'admisiones-anulacion-pendiente'
                        },


                        {
                            label: 'Estados de las solicitudes',
                            icon: 'fa-solid fa-truck',
                            url: 'general-requests'
                        },

                        {
                            label: 'Logs',
                            icon: 'fa-solid fa-truck',
                            url: 'logsAuditoria'
                        }
                    ]
                },



                { label: 'Comunidad', icon: 'fa-solid fa-people-roof', url: 'social' },
                { label: 'Manual De Usuario', icon: 'fa-solid fa-book-open', url: 'manualUsuario' }


            ]
        },

        {
            label: 'Contabilidad',
            icon: 'fa-solid fa-money-check-dollar',
            items: [
                {
                    label: 'Facturacion',
                    icon: 'fa-solid fa-boxes-stacked',
                    items: [
                        {
                            label: 'Facturaciónes',
                            icon: 'fa-solid fa-truck',
                            url: 'FE_FCE'
                        },
                        {
                            label: 'Recibos de Caja',
                            icon: 'fa-solid fa-truck',
                            url: 'RecibosDeCajas'
                        },
                        {
                            label: 'Cuentas x Cobrar y Pagar',
                            icon: 'fa-solid fa-truck',
                            url: 'CuentasCobrarPagar'
                        },

                        {
                            label: 'Cierre de Caja',
                            icon: 'fa-solid fa-truck',
                            url: 'controlCaja'
                        },

                        {
                            label: 'Control Cierre de Caja',
                            icon: 'fa-solid fa-truck',
                            url: 'reporteCaja'
                        },

                        {
                            label: 'Bancos',
                            icon: 'fa-solid fa-truck',
                            url: 'BancosContables'
                        },

                    ]
                },
                {
                    label: 'Contable',
                    icon: 'fa-solid fa-boxes-stacked',
                    items: [
                        {
                            label: 'Cuentas Contables',
                            icon: 'fa-solid fa-boxes-stacked',
                            url: 'CuentasContables'
                        },

                        {
                            label: 'Comprobantes Contables',
                            icon: 'fa-solid fa-truck',
                            url: 'ComprobantesContables'
                        },

                        {
                            label: 'Cierres Contables',
                            icon: 'fa-solid fa-truck',
                            url: 'CierresContables'
                        },

                        {
                            label: 'Auditoria Contable',
                            icon: 'fa-solid fa-truck',
                            url: 'FE_ContabilidadNueva'
                        },

                    ]
                },
                {
                    label: 'Configuración Contable',
                    icon: 'fa-solid fa-truck',
                    items: [
                        {
                            label: 'Metodos de Pago',
                            icon: 'fa-solid fa-boxes-stacked',
                            url: 'metodosPago'
                        },

                        {
                            label: 'Impuestos',
                            icon: 'fa-solid fa-truck',
                            url: 'impuestos'
                        },


                        {
                            label: 'Retenciones',
                            icon: 'fa-solid fa-truck',
                            url: 'retenciones'
                        },

                        {
                            label: 'Centros de Costo',
                            icon: 'fa-solid fa-truck',
                            url: 'centroCosto'
                        },

                        {
                            label: 'Facturacion',
                            icon: 'fa-solid fa-truck',
                            url: 'facturacionConfiguracion'
                        }
                    ]
                },

                {
                    label: 'Gestión de Activos',
                    icon: 'fa-solid fa-truck',
                    url: 'ActivosFijos'
                },

                {
                    label: 'Gestión de Terceros',
                    icon: 'fa-solid fa-truck',
                    url: 'GestionarTerceros'
                },

            ]
        },
    ];

    const iconTemplate = (iconClass) => {
        return <i className={iconClass}></i>;
    };

    const processItems = (items) => {
        return items.map(item => {
            const processedItem = { ...item };

            if (item.icon) {
                processedItem.icon = () => iconTemplate(item.icon);
            }

            if (item.items) {
                processedItem.items = processItems(item.items);
            }

            return processedItem;
        });
    };

    const processedItems = processItems(items);

    return (
        <div className="navbar-megamenu-cnpontainer">
            <Menubar
                model={processedItems}
                className="custom-responsive-megamenu"
            />
            <style>{`
                .navbar-megamenu-container {
                    flex-grow: 1;
                    display: flex;
                    justify-content: center;
                    margin: 0 1rem;
                    width: 100%;
                }

                .custom-responsive-megamenu {
                    border: none !important;
                    background: transparent !important;
                }

                /* Estilos para modo claro */
                :root:not(.p-dark) .custom-responsive-megamenu .p-menuitem-link {
                    gap:5px;
                    color: #495057 !important;
                }

                :root:not(.p-dark) .custom-responsive-megamenu .p-menuitem-link:hover {
                    background-color: #e9ecef !important;
                    color: #495057 !important;
                }

                :root:not(.p-dark) .custom-responsive-megamenu .p-submenu-list {
                    background: #ffffff !important;
                    border: 1px solid #e5e7eb !important;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
                }

                :root:not(.p-dark) .custom-responsive-megamenu .p-menuitem-content:hover {
                    background: #f8f9fa !important;
                }

                :root:not(.p-dark) .custom-responsive-megamenu .p-menuitem-text {
                    color: #495057 !important;
                }

                /* Estilos para modo oscuro */
                .p-dark .custom-responsive-megamenu .p-menuitem-link {
                    color: rgba(255, 255, 255, 0.87) !important;
                    background-color: #1f2937 !important;
                }

                .p-dark .custom-responsive-megamenu .p-menuitem-link:hover {
                    background-color: #374151 !important;
                    color: rgba(255, 255, 255, 0.87) !important;
                }

                .p-dark .custom-responsive-megamenu .p-submenu-list {
                    background: #1f2937 !important;
                    border: 1px solid #374151 !important;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.4) !important;
                }

                .p-dark .custom-responsive-megamenu .p-menuitem-content {
                    background: #1f2937 !important;
                    color: rgba(255, 255, 255, 0.87) !important;
                }

                .p-dark .custom-responsive-megamenu .p-menuitem-content:hover {
                    background: #374151 !important;
                }

                .p-dark .custom-responsive-megamenu .p-menuitem-text {
                    color: rgba(255, 255, 255, 0.87) !important;
                }

                .p-dark .custom-responsive-megamenu .p-submenu-icon {
                    color: rgba(255, 255, 255, 0.6) !important;
                }

                .custom-responsive-megamenu .p-menubar-root-list {
                    width: 100%;
                    margin: 0;
                    padding: 0;
                }

                .custom-responsive-megamenu .p-menuitem-link {
                    display: flex;
                    align-items: center;
                    font-weight: 600;
                    padding: 0.75rem 1rem !important;
                    border-radius: 6px;
                    transition: background-color 0.2s;
                }

                .custom-responsive-megamenu .p-menuitem-icon {
                    margin-right: 0.5rem;
                    font-size: 1.1rem;
                }

                .custom-responsive-megamenu .p-submenu-list {
                    border-radius: 8px !important;
                    padding: 0.5rem 0 !important;
                    min-width: 200px;
                }

                /* Estilo específico para el tercer nivel */
                .custom-responsive-megamenu .p-submenu-list .p-submenu-list {
                    margin-top: -0.5rem;
                    margin-left: 0.25rem;
                }

                .custom-responsive-megamenu .p-menuitem {
                    margin: 0.25rem 0;
                }

                .custom-responsive-megamenu .p-menuitem-content {
                    border-radius: 6px !important;
                    transition: background-color 0.2s;
                }

                /* Estilos responsive para móviles */
                @media screen and (max-width: 960px) {
                    .p-menubar.p-menubar-mobile-active .p-menubar-root-list {
                        width: 300px !important;
                        background: #ffffff !important;
                    }
                    
                    .p-dark .p-menubar.p-menubar-mobile-active .p-menubar-root-list {
                        background: #1f2937 !important;
                    }
                    
                    .navbar-megamenu-container {
                        margin: 0;
                    }
                    
                    .custom-responsive-megamenu .p-menubar-root-list {
                        flex-direction: column;
                    }
                    
                    .custom-responsive-megamenu .p-menuitem-link {
                        padding: 0.75rem 1rem !important;
                        justify-content: flex-start;
                    }
                    
                    .custom-responsive-megamenu .p-submenu-list {
                        position: static !important;
                        width: 100% !important;
                        box-shadow: none !important;
                        border: none !important;
                        border-top: 1px solid #e5e7eb !important;
                        border-radius: 0 !important;
                    }
                    
                    .p-dark .custom-responsive-megamenu .p-submenu-list {
                        border-top: 1px solid #374151 !important;
                    }
                    
                    /* Ajustes para tercer nivel en móviles */
                    .custom-responsive-megamenu .p-submenu-list .p-submenu-list {
                        margin-left: 1rem;
                        border-left: 2px solid #e5e7eb;
                    }
                    
                    .p-dark .custom-responsive-megamenu .p-submenu-list .p-submenu-list {
                        border-left: 2px solid #374151;
                    }
                }

                /* Estilos para desktop */
                @media screen and (min-width: 961px) {
                    .navbar-megamenu-container {
                        margin: 0 200pxrem auto;
                    }
                    
                    .custom-responsive-megamenu .p-menubar-root-list {
                        display:flex;
                        justify-content: flex-end;
                        gap: 2rem;
                    }
                    
                    .custom-responsive-megamenu .p-submenu-list {
                        max-height: 80vh;
                    }
                }
            `}</style>
        </div>
    );
};

export default NavbarHeader;