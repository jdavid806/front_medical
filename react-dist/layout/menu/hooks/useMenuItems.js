import { useEffect, useState } from "react";
import { menuService } from "../../../../services/api/index.js";
import { items } from "../dataMenu.js";
export const useMenuItems = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadMenu = async () => {
      try {
        setLoading(true);
        try {
          const allMenus = await menuService.getAllMenu();
          setMenuItems(allMenus.menus);
        } catch (error) {
          setMenuItems(items);
        }
      } catch (error) {
        setMenuItems(items);
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