import React from "react";
export const processMenuIcons = (items = []) => {
  const iconTemplate = iconClass => /*#__PURE__*/React.createElement("i", {
    className: iconClass
  });
  return items.map(item => {
    const newItem = {
      ...item
    };
    if (item.icon) {
      newItem.icon = () => iconTemplate(item.icon);
    }
    if (item.items) {
      newItem.items = processMenuIcons(item.items);
    }
    return newItem;
  });
};