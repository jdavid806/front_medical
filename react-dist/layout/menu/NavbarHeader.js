import { Menubar } from "primereact/menubar";
import React, { useEffect, useState } from "react";
import { menuService } from "../../../services/api/index.js";
import { filterMenuItems } from "../../helpers/menuFilter.js";
import { items } from "./dataMenu.js";
const NavbarHeader = () => {
  const [menuItems, setMenuItems] = useState([]);
  useEffect(() => {
    const loadMenu = async () => {
      // 🔹 Paso 1: Obtener los permisos del backend
      const backendMenus = JSON.parse(localStorage.getItem("menus")) || [];
      const allowedKeys = backendMenus.map(m => m.key); // ['pacientes', 'citas', ...]

      // 🔹 Paso 2: Obtener todos los ítems del MenuService
      const menuMapping = await menuService.getAll(); // [{ key_: 'pacientes', route: 'pacientes' }, ...]

      // 🔹 Paso 3: Filtrar los que tienen permiso
      const allowedRoutes = menuMapping.filter(menu => allowedKeys.includes(menu.key_)).map(menu => menu.route).filter(Boolean); // por si algún `route` es undefined

      // 🔹 Paso 4: Filtrar tu menú real usando los `route`
      const filtered = filterMenuItems(items, allowedRoutes);
      setMenuItems(filtered);
    };
    loadMenu();
  }, []);
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
  const processedItems = processItems(menuItems);
  console.log("processed", processedItems);
  return /*#__PURE__*/React.createElement("div", {
    className: "navbar-megamenu-container"
  }, /*#__PURE__*/React.createElement(Menubar, {
    model: processedItems,
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
                        margin: 0 8rem auto;
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
            `));
};
export default NavbarHeader;