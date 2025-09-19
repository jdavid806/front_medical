import React from "react";
import { Tree } from "primereact/tree";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
export const MenubarTreeSettings = ({
  menuItems,
  onMenuItemsChange
}) => {
  const [selectedNode, setSelectedNode] = React.useState(null);
  const [editDialogVisible, setEditDialogVisible] = React.useState(false);
  const [newItem, setNewItem] = React.useState({
    label: "",
    icon: "",
    url: ""
  });
  const convertToTreeNode = menuItems => {
    return menuItems.map((item, index) => ({
      key: `${index}-${item.label}`,
      label: item.label,
      icon: item.icon,
      data: item,
      children: item.items ? convertToTreeNode(item.items) : undefined
    }));
  };
  const findAndUpdateItem = (items, key, updates) => {
    return items.map(item => {
      const itemKey = `${items.indexOf(item)}-${item.label}`;
      if (itemKey === key) {
        return {
          ...item,
          ...updates
        };
      }
      if (item.items) {
        return {
          ...item,
          items: findAndUpdateItem(item.items, key, updates)
        };
      }
      return item;
    });
  };
  const findAndAddItem = (items, parentKey, newItem) => {
    if (parentKey === null) {
      return [...items, newItem];
    }
    return items.map(item => {
      const itemKey = `${items.indexOf(item)}-${item.label}`;
      if (itemKey === parentKey) {
        return {
          ...item,
          items: [...(item.items || []), newItem]
        };
      }
      if (item.items) {
        return {
          ...item,
          items: findAndAddItem(item.items, parentKey, newItem)
        };
      }
      return item;
    });
  };
  const findAndRemoveItem = (items, key) => {
    return items.filter(item => {
      const itemKey = `${items.indexOf(item)}-${item.label}`;
      if (itemKey === key) {
        return false;
      }
      if (item.items) {
        item.items = findAndRemoveItem(item.items, key);
      }
      return true;
    });
  };
  const handleEdit = node => {
    setSelectedNode(node);
    setNewItem(node.data);
    setEditDialogVisible(true);
  };
  const handleSave = () => {
    if (selectedNode) {
      const updatedItems = findAndUpdateItem(menuItems, selectedNode.key, newItem);
      onMenuItemsChange(updatedItems);
    } else {
      const updatedItems = findAndAddItem(menuItems, null, newItem);
      onMenuItemsChange(updatedItems);
    }
    setEditDialogVisible(false);
    setSelectedNode(null);
    setNewItem({
      label: "",
      icon: "",
      url: ""
    });
  };
  const handleAddSubmenu = () => {
    if (selectedNode) {
      const newSubItem = {
        label: "Nuevo Submenú",
        icon: "",
        url: ""
      };
      const updatedItems = findAndAddItem(menuItems, selectedNode.key, newSubItem);
      onMenuItemsChange(updatedItems);
    }
  };
  const handleDelete = () => {
    if (selectedNode) {
      const updatedItems = findAndRemoveItem(menuItems, selectedNode.key);
      onMenuItemsChange(updatedItems);
      setEditDialogVisible(false);
      setSelectedNode(null);
    }
  };
  const nodeTemplate = node => {
    return /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-between align-items-center w-100"
    }, /*#__PURE__*/React.createElement("div", null, node.icon && /*#__PURE__*/React.createElement("i", {
      className: `${node.icon} mr-2`
    }), /*#__PURE__*/React.createElement("span", null, node.label)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fas fa-edit"
      }),
      className: "p-button-text p-button-sm",
      onClick: e => {
        e.stopPropagation();
        handleEdit(node);
      }
    })));
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Agregar Men\xFA Principal",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-plus"
    }),
    onClick: () => {
      setSelectedNode(null);
      setNewItem({
        label: "Nuevo Menú",
        icon: "",
        url: ""
      });
      setEditDialogVisible(true);
    }
  }), /*#__PURE__*/React.createElement(Tree, {
    value: convertToTreeNode(menuItems),
    nodeTemplate: nodeTemplate,
    selectionMode: "single",
    onSelect: e => setSelectedNode(e.node),
    className: "w-100"
  })), /*#__PURE__*/React.createElement(Dialog, {
    visible: editDialogVisible,
    onHide: () => setEditDialogVisible(false),
    header: selectedNode ? "Editar Menú" : "Agregar Menú",
    style: {
      width: '50vw'
    },
    footer: /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
      label: "Cancelar",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fas fa-times"
      }),
      onClick: () => setEditDialogVisible(false),
      className: "p-button-text"
    }), selectedNode && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      label: "Agregar Submen\xFA",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fas fa-plus"
      }),
      onClick: handleAddSubmenu,
      className: "p-button-success"
    }), /*#__PURE__*/React.createElement(Button, {
      label: "Eliminar",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fas fa-trash"
      }),
      onClick: handleDelete,
      className: "p-button-danger"
    })), /*#__PURE__*/React.createElement(Button, {
      label: "Guardar",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fas fa-check"
      }),
      onClick: handleSave,
      autoFocus: true
    }))
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "label",
    className: "form-label"
  }, "Label"), /*#__PURE__*/React.createElement(InputText, {
    id: "label",
    value: newItem.label,
    onChange: e => setNewItem({
      ...newItem,
      label: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "icon",
    className: "form-label"
  }, "Icono (Clase FontAwesome)"), /*#__PURE__*/React.createElement(InputText, {
    id: "icon",
    value: newItem.icon || "",
    onChange: e => setNewItem({
      ...newItem,
      icon: e.target.value
    }),
    placeholder: "fa-solid fa-house"
  })), /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "url",
    className: "form-label"
  }, "URL"), /*#__PURE__*/React.createElement(InputText, {
    id: "url",
    value: newItem.url || "",
    onChange: e => setNewItem({
      ...newItem,
      url: e.target.value
    }),
    placeholder: "/ruta"
  })))));
};