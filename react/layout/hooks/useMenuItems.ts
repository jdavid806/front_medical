import { useEffect, useState } from "react";
import { menuService } from "../../../services/api";
import { items } from "./dataMenu";
import { filterMenuItems } from "../../helpers/menuFilter";

export const useMenuItems = () => {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const loadMenu = async () => {
      const backendMenus = JSON.parse(localStorage.getItem("menus") || "[]");
      const roles = JSON.parse(localStorage.getItem("roles") || "{}");
      const roleId = roles?.id;

      const rolesConMenuCompleto = [2, 4, 9, 13];

      if (rolesConMenuCompleto.includes(roleId)) {
        setMenuItems(items);
        return;
      }

      const allowedKeys = backendMenus.map((m) => m.key);
      const allMenus = await menuService.getAll();

      const allowedRoutes = allMenus
        .filter((menu) => allowedKeys.includes(menu.key_))
        .map((menu) => menu.route)
        .filter(Boolean);

      const filtered = filterMenuItems(items, allowedRoutes);
      setMenuItems(filtered);
    };

    loadMenu();
  }, []);

  return menuItems;
};
