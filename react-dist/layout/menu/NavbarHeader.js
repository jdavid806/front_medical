import { MegaMenu } from 'primereact/megamenu';
import React from 'react';
const NavbarHeader = () => {
  const items = [{
    label: 'Home',
    icon: 'pi pi-home',
    items: [[{
      label: 'Home',
      items: [{
        label: 'Inicio',
        icon: 'pi pi-home',
        url: 'Dashboard'
      }, {
        label: 'Consultas',
        icon: 'pi pi-users',
        url: 'pacientes'
      }, {
        label: 'Admisiones',
        icon: 'pi pi-user-plus',
        url: 'citasControl'
      }, {
        label: 'Telemedicina',
        icon: 'pi pi-video',
        url: 'telemedicina'
      }, {
        label: 'Turnos',
        icon: 'pi pi-desktop',
        url: 'homeTurnos'
      }, {
        label: 'Farmacia',
        icon: 'pi pi-book-open',
        url: 'homeFarmacia'
      }, {
        label: 'Laboratorio',
        icon: 'pi pi-chart-line',
        url: 'verOrdenesExamenesGenerales'
      }]
    }]]
  }, {
    label: 'Reportes',
    icon: 'pi pi-chart-bar',
    items: [[{
      items: [{
        label: 'Facturación',
        icon: 'pi pi-briefcase',
        url: 'Invoices'
      }, {
        label: 'Facturas x Entidad',
        icon: 'pi pi-briefcase',
        url: 'InvoicesByEntity'
      }, {
        label: 'Especialistas',
        icon: 'pi pi-briefcase',
        url: 'InvoicesDoctors'
      }, {
        label: 'Bonificaciones',
        icon: 'pi pi-briefcase',
        url: 'Commissions'
      }, {
        label: 'Citas',
        icon: 'pi pi-briefcase',
        url: 'AppointmentsReport'
      }]
    }]]
  }, {
    label: 'Administración',
    icon: 'pi pi-cog',
    items: [[{
      items: [{
        label: 'Marketing',
        icon: 'pi pi-briefcase',
        url: 'homeMarketing'
      }, {
        label: 'Configuración',
        icon: 'pi pi-sliders-h',
        url: 'homeConfiguracion'
      }, {
        label: 'Inventario',
        icon: 'pi pi-folder',
        url: 'homeInventario'
      }, {
        label: 'Auditoria',
        icon: 'pi pi-user-edit',
        url: 'homeAuditoria'
      }, {
        label: 'Contabilidad',
        icon: 'pi pi-file',
        url: 'homeContabilidad'
      }, {
        label: 'Comunidad',
        icon: 'pi pi-comments',
        url: 'social'
      }]
    }]]
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "navbar-megamenu-container"
  }, /*#__PURE__*/React.createElement(MegaMenu, {
    model: items,
    orientation: "horizontal",
    breakpoint: "960px",
    className: "custom-responsive-megamenu"
  }), /*#__PURE__*/React.createElement("style", null, `
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
                    width: 100%;
                }

                .custom-responsive-megamenu .p-megamenu-root-list {
                    display: flex;
                    justify-content: center;
                    width: 100%;
                    margin: 0;
                    padding: 0;
                }

                .custom-responsive-megamenu .p-menuitem-link {
                    display: flex;
                    align-items: center;
                    font-weight: 600;
                    color: var(--text-color) !important;
                }

                .custom-responsive-megamenu .p-menuitem-icon {
                    margin-right: 0.5rem;
                    font-size: 1.1rem;
                }

                .custom-responsive-megamenu .p-megamenu-panel {
                    background: white !important;
                    border: 1px solid #e5e7eb !important;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
                    border-radius: 8px !important;
                }

                .custom-responsive-megamenu .p-megamenu-grid {
                }

                .custom-responsive-megamenu .p-submenu-list {
                    padding: 0.5rem 0 !important;
                }

                .custom-responsive-megamenu .p-menuitem {
                    margin: 0.25rem 0;
                }

                .custom-responsive-megamenu .p-menuitem-content {
                    border-radius: 6px !important;
                }

                .custom-responsive-megamenu .p-menuitem-content:hover {
                    background: #f8f9fa !important;
                }

                /* Estilos responsive para móviles */
                @media screen and (max-width: 960px) {

                  .p-megamenu[pr_id_2].p-megamenu-mobile-active .p-megamenu-root-list{
                width: 300px !important;
                }
                    .navbar-megamenu-container {
                        margin: 0;
                    }
                    
                    .custom-responsive-megamenu .p-megamenu-root-list {
                        flex-direction: column;
                    }
                    
                    .custom-responsive-megamenu .p-menuitem-link {
                        padding: 0.75rem 1rem !important;
                        justify-content: center;
                    }
                    
                    .custom-responsive-megamenu .p-megamenu-panel {
                        position: static !important;
                        width: 100% !important;
                        box-shadow: none !important;
                        border: none !important;
                        border-top: 1px solid #e5e7eb !important;
                        border-radius: 0 !important;
                    }
                }

                /* Estilos para desktop */
                @media screen and (min-width: 961px) {
                    .navbar-megamenu-container {
                        margin: 0 auto;
                        margin-right: 900px;
                    }
                    
                    .custom-responsive-megamenu .p-megamenu-root-list {
                        justify-content: center;
                        gap: 0.5rem;
                    }
                }
               
            `));
};
export default NavbarHeader;