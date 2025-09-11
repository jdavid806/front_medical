import { useEffect, useState } from "react";
import { menuService } from "../../../../services/api";
import { items } from "../dataMenu";
import { filterMenuItems } from "../../../helpers/menuFilter";

const removeEmptySections = (menu: any[]) => {
  return menu
    .map((item) => {
      if (item.items) {
        const children = removeEmptySections(item.items);
        if (children.length > 0) {
          return { ...item, items: children };
        }
      }

      if (item.url || (item.items && item.items.length > 0)) {
        return item;
      }

      return null;
    })
    .filter(Boolean);
};

export const useMenuItems = () => {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const loadMenu = async () => {
      const backendMenus = JSON.parse(localStorage.getItem("menus") || "[]");
      const roles = JSON.parse(localStorage.getItem("roles") || "{}");
      const roleId = roles?.id;

      const rolesConMenuCompleto = [2, 9, 13];

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
      const cleaned = removeEmptySections(filtered);
      setMenuItems(cleaned);
    };

    loadMenu();
  }, []);

  return menuItems;
};
