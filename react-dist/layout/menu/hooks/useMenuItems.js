import { useEffect, useState } from "react";
import { menuService } from "../../../../services/api/index.js";
import { items } from "../dataMenu.js";
import { filterMenuItems } from "../../../helpers/menuFilter.js";
const transformBackendMenu = backendItems => {
  return backendItems.map(item => ({
    label: item.name,
    icon: item.icon,
    url: item.route,
    items: item.children && item.children.length > 0 ? transformBackendMenu(item.children) : undefined
  })).filter(item => item.label);
};
const removeEmptySections = menu => {
  return menu.map(item => {
    if (item.items) {
      const children = removeEmptySections(item.items);
      if (children.length > 0) {
        return {
          ...item,
          items: children
        };
      }
    }
    if (item.url || item.items && item.items.length > 0) {
      return item;
    }
    return null;
  }).filter(Boolean);
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
        try {
          const allMenus = await menuService.getAllMenu();
          const transformedMenus = transformBackendMenu(allMenus);
          const cleanedMenus = removeEmptySections(transformedMenus);
          setMenuItems(cleanedMenus);
        } catch (error) {
          console.error("Error loading backend menus, using static menu:", error);
          setMenuItems(items);
        }
        return;
      }
      try {
        const allowedKeys = backendMenus.map(m => m.key);
        const allMenus = await menuService.getAllMenu();
        const filteredBackendMenus = allMenus.filter(menu => allowedKeys.includes(menu.key_));
        const transformedMenus = transformBackendMenu(filteredBackendMenus);
        const cleanedMenus = removeEmptySections(transformedMenus);
        setMenuItems(cleanedMenus);
      } catch (error) {
        console.error("Error loading filtered backend menus, using static menu with filters:", error);
        const allowedKeys = backendMenus.map(m => m.key);
        const allMenus = await menuService.getAll();
        const allowedRoutes = allMenus.filter(menu => allowedKeys.includes(menu.key_)).map(menu => menu.route).filter(Boolean);
        const filtered = filterMenuItems(items, allowedRoutes);
        const cleaned = removeEmptySections(filtered);
        setMenuItems(cleaned);
      }
    };
    loadMenu();
  }, []);
  return menuItems;
};