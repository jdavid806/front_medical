export function hasPermission(permissionKey) {
  const role = JSON.parse(localStorage.getItem("roles"));
  const permissions = JSON.parse(localStorage.getItem("permissions")) || [];
  const bypassRoles = [9, 13, 14];
  if (bypassRoles.includes(role?.id)) return true;
  return permissions.some(p => p.key === permissionKey);
}
export const filterMenuItems = (menuItems, allowedRoutes) => {
  const filterRecursive = items => {
    return items.map(item => {
      const newItem = {
        ...item
      };
      if (item.items) {
        newItem.items = filterRecursive(item.items);
      }
      const isAllowed = !item.url || allowedRoutes.includes(item.url);
      if (isAllowed || newItem.items && newItem.items.length > 0) {
        return newItem;
      }
      return null;
    }).filter(Boolean);
  };
  return filterRecursive(menuItems);
};