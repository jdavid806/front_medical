import { useEffect, useState } from "react";
import { menuService } from "../../../../services/api/index.js";
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
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadMenu = async () => {
      setLoading(true);
      try {
        const allMenus = await menuService.getAllMenu();
        // const transformedMenus = transformBackendMenu(allMenus.menus);
        // const cleanedMenus = removeEmptySections(transformedMenus);
        setMenuItems(allMenus.menus);
      } catch (error) {
        console.error("error fetching menu", error);
        // setMenuItems(allMenus);
      } finally {
        setLoading(false);
      }
    };
    loadMenu();
  }, []);
  return {
    menuItems,
    loading
  };
};