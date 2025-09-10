export function filterMenusByRole(user, allMenus) {
  const bypassRoles = [9, 13, 14];
  if (bypassRoles.includes(user?.role?.id)) {
    return allMenus;
  }
  const allowedKeys = user?.role?.menus?.map(m => m.key) || [];
  return allMenus.filter(menu => allowedKeys.includes(menu.key_));
}
export function mapMenusToMenubar(menus) {
  return menus.map(menu => {
    const parts = menu.name.split('|').map(s => s.trim());
    const label = parts[parts.length - 1];
    const item = {
      label,
      url: menu.route,
      icon: 'fa-solid fa-folder'
    };
    if (menu.children && menu.children.length > 0) {
      item.items = mapMenusToMenubar(menu.children);
    }
    return item;
  });
}