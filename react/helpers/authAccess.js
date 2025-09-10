export function filterMenuItems(items, allowedKeys, bypass = false) {
  return items
    .filter(item => {
      if (bypass) return true;

      if (item.url) {
        return allowedKeys.includes(item.url);
      }

      return true;
    })
    .map(item => {
      const newItem = { ...item };

      if (item.items) {
        newItem.items = filterMenuItems(item.items, allowedKeys, bypass);
        if (newItem.items.length === 0 && !item.url) {
          return null;
        }
      }

      return newItem;
    })
    .filter(Boolean);
}
