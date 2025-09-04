import { MegaMenu } from 'primereact/megamenu';
import React from 'react';

const NavbarHeader = () => {
    const items = [
        {
            label: 'Home',
            icon: <i className="fa-solid fa-house"></i>,
            items: [
                [
                    {
                        label: 'Principal',
                        items: [
                            { label: 'Inicio', icon: <i className="fa-solid fa-house"></i>, url: 'Dashboard' },
                            { label: 'Consultas', icon: <i className="fa-solid fa-magnifying-glass"></i>, url: 'pacientes' },
                            { label: 'Admisiones', icon: <i className="fa-solid fa-bookmark"></i>, url: 'citasControl' },

                            { label: 'Telemedicina', icon: <i className="fa-solid fa-stethoscope"></i>, url: 'telemedicina' },
                            { label: 'Turnos', icon: <i className="fa-solid fa-ticket"></i>, url: 'homeTurnos' },
                            { label: 'Farmacia', icon: <i className="fa-solid fa-shop"></i>, url: 'homeFarmacia' },
                            { label: 'Laboratorio', icon: <i className="fa-solid fa-flask"></i>, url: 'verOrdenesExamenesGenerales' }
                        ]
                    }
                ]
            ]
        },
        {
            label: 'Reportes',
            icon: <i className="fa-solid fa-file-excel"></i>,
            items: [
                [
                    {
                        label: 'Reportes Importantes',
                        items: [
                            { label: 'Facturación', icon: <i className="fa-solid fa-money-bill"></i>, url: 'Invoices' },
                            { label: 'Facturas x Entidad', icon: <i className="fa-solid fa-money-bill-wave"></i>, url: 'InvoicesByEntity' },
                            { label: 'Especialistas', icon: <i className="fa-solid fa-user-doctor"></i>, url: 'InvoicesDoctors' },
                            { label: 'Bonificaciones', icon: <i className="fa-solid fa-money-bill-trend-up"></i>, url: 'Commissions' },
                            { label: 'Citas', icon: <i className="fa-solid fa-calendar-week"></i>, url: 'AppointmentsReport' }
                        ]
                    }
                ]
            ]
        },
        {
            label: 'Administración',
            icon: <i className="fa-solid fa-user-gear ml-2"></i>,
            items: [
                [
                    {
                        label: 'Administrar Procesos',
                        items: [
                            { label: 'Marketing', icon: <i className="fa-solid fa-folder-tree"></i>, url: 'homeMarketing' },
                            { label: 'Configuración', icon: <i className="fa-solid fa-wrench"></i>, url: 'homeConfiguracion' },
                            { label: 'Inventario', icon: <i className="fa-solid fa-truck-ramp-box"></i>, url: 'homeInventario' },
                            { label: 'Auditoria', icon: <i className="fa-solid fa-person-chalkboard"></i>, url: 'homeAuditoria' },
                            { label: 'Contabilidad', icon: <i className="fa-solid fa-money-check-dollar"></i>, url: 'homeContabilidad' },
                            { label: 'Comunidad', icon: <i className="fa-solid fa-people-roof"></i>, url: 'social' },
                            { label: 'Manual De Usuario', icon: <i className="fa-solid fa-book-open"></i>, url: 'manualUsuario' }
                        ]
                    }
                ]
            ]
        }
    ];

    return (
        <div className="navbar-megamenu-container">
            <MegaMenu
                model={items}
                orientation="horizontal"
                breakpoint="960px"
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
                    width: 100%;
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

                :root:not(.p-dark) .custom-responsive-megamenu .p-megamenu-panel {
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

                .p-dark .custom-responsive-megamenu .p-megamenu-panel {
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
                    padding: 0.75rem 1rem !important;
                    border-radius: 6px;
                    transition: background-color 0.2s;
                }

                .custom-responsive-megamenu .p-menuitem-icon {
                    margin-right: 0.5rem;
                    font-size: 1.1rem;
                }

                .custom-responsive-megamenu .p-megamenu-panel {
                    border-radius: 8px !important;
                }

                .custom-responsive-megamenu .p-submenu-list {
                    padding: 0.5rem 0 !important;
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
                    .p-megamenu.p-megamenu-mobile-active .p-megamenu-root-list {
                        width: 300px !important;
                        background: #ffffff !important;
                    }
                    
                    .p-dark .p-megamenu.p-megamenu-mobile-active .p-megamenu-root-list {
                        background: #1f2937 !important;
                    }
                    
                    .navbar-megamenu-container {
                        margin: 0;
                    }
                    
                    .custom-responsive-megamenu .p-megamenu-root-list {
                        flex-direction: column;
                    }
                    
                    .custom-responsive-megamenu .p-menuitem-link {
                        padding: 0.75rem 1rem !important;
                        justify-content: flex-start;
                    }
                    
                    .custom-responsive-megamenu .p-megamenu-panel {
                        position: static !important;
                        width: 100% !important;
                        box-shadow: none !important;
                        border: none !important;
                        border-top: 1px solid #e5e7eb !important;
                        border-radius: 0 !important;
                    }
                    
                    .p-dark .custom-responsive-megamenu .p-megamenu-panel {
                        border-top: 1px solid #374151 !important;
                    }
                }

                /* Estilos para desktop */
                @media screen and (min-width: 961px) {
                    .navbar-megamenu-container {
                        margin: 0 8rem auto;
                    }
                    
                    .custom-responsive-megamenu .p-megamenu-root-list {
                        display:flex;
                        justify-content: flex-end;
                        gap: 2rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default NavbarHeader;