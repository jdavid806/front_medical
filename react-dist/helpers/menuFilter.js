export function hasPermission(permissionKey) {
  const role = JSON.parse(localStorage.getItem("roles"));
  const permissions = JSON.parse(localStorage.getItem("permissions")) || [];
  const bypassRoles = [9, 13, 14];
  if (bypassRoles.includes(role?.id)) return true;
  return permissions.some(p => p.key === permissionKey);
}
export const filterMenuItems = (items, allowedKeys, bypass = false) => {
  if (bypass) return items;
  return items.map(item => {
    // Si tiene hijos, los filtramos recursivamente
    if (item.items) {
      const filteredSubItems = filterMenuItems(item.items, allowedKeys, bypass);
      if (filteredSubItems.length > 0) {
        return {
          ...item,
          items: filteredSubItems
        };
      }
    }

    // Si tiene URL, verificamos si está permitido por los keys
    if (item.url && allowedKeys.includes(item.url)) {
      return item;
    }

    // Si no tiene hijos válidos ni URL válida, se elimina
    return null;
  }).filter(item => item !== null);
};