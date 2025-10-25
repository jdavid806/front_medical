import React, { useState } from "react";
import { userRolesService } from "../../../services/api/index";
import { ErrorHandler } from "../../../services/errorHandler";
import { SwalManager } from "../../../services/alertManagerImported";
import { UserRoleFormInputs } from "../components/UserRoleForm";

export const useUserRoleUpdate = () => {
  const [loading, setLoading] = useState(true);

  // Función para aplanar todos los menús recursivamente
  const flattenAllMenus = (menus: any[]): any[] => {
    const allMenus: any[] = [];
    
    const traverse = (menuList: any[]) => {
      menuList.forEach(menu => {
        allMenus.push({
          id: menu.id,
          label: menu.label
        });
        if (menu.items && menu.items.length > 0) {
          traverse(menu.items);
        }
      });
    };
    
    traverse(menus);
    return allMenus;
  };

  const updateUserRole = async (id: string, data: UserRoleFormInputs) => {
    setLoading(true);
    try {
      console.log("=== DEBUG UPDATE ===");
      console.log("menuIds seleccionados:", data.menuIds);
      console.log("Cantidad de menuIds:", data.menuIds.length);
      
      // Aplanar TODOS los menús del árbol
      const allFlattenedMenus = flattenAllMenus(data.menus);
      console.log("Todos los menús aplanados:", allFlattenedMenus);
      console.log("Cantidad total de menús:", allFlattenedMenus.length);
      
      // Crear el payload con TODOS los menús del sistema
      const payloadMenus = allFlattenedMenus.map((menu) => {
        const isActive = data.menuIds.includes(menu.id);
        return {
          menu_id: menu.id,
          is_active: isActive
        };
      });

      const payload = {
        menus: payloadMenus
      };

      // Debug: contar cuántos true/false
      const activeCount = payload.menus.filter(menu => menu.is_active).length;
      const inactiveCount = payload.menus.filter(menu => !menu.is_active).length;
      
      console.log(`=== RESUMEN ===`);
      console.log(`Total menús: ${payload.menus.length}`);
      console.log(`Activos (true): ${activeCount}`);
      console.log(`Inactivos (false): ${inactiveCount}`);
      
      // Mostrar algunos ejemplos específicos
      console.log(`Ejemplos - Menú 1 (Home): ${data.menuIds.includes(1)}`);
      console.log(`Ejemplos - Menú 2 (Inicio): ${data.menuIds.includes(2)}`);
      console.log(`Ejemplos - Menú 23 (Reportes): ${data.menuIds.includes(23)}`);
      console.log(`Ejemplos - Menú 30 (Administración): ${data.menuIds.includes(30)}`);
      
      console.log("Payload final:", JSON.stringify(payload, null, 2));
      
      await userRolesService.saveRoleMenus(id, payload.menus);
      SwalManager.success();
      
    } catch (error) {
      ErrorHandler.generic(error);
      console.error("Error detallado:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    updateUserRole,
    loading,
  };
};