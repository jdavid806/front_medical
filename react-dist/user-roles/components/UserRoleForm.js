function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { menuService, permissionService } from "../../../services/api/index.js";
import { PrimeReactProvider } from 'primereact/api';
const roleGroupOptions = [{
  label: 'Médico',
  value: 'DOCTOR'
}, {
  label: 'Administrativo',
  value: 'ADMIN'
}, {
  label: 'Asistente médico',
  value: 'DOCTOR_ASSISTANT'
}, {
  label: 'Auxiliar',
  value: 'ASSISTANT'
}];

// Componente de acordeón recursivo - TODOS los niveles con el mismo diseño
const MenuAccordion = ({
  menus,
  selectedMenuIds,
  onMenuChange,
  level = 0
}) => {
  const [expandedItems, setExpandedItems] = useState([]);
  const toggleItem = menuId => {
    setExpandedItems(prev => prev.includes(menuId) ? prev.filter(id => id !== menuId) : [...prev, menuId]);
  };
  const hasChildren = menu => menu.items && menu.items.length > 0;
  const handleMenuChangeWithChildren = (menu, checked) => {
    onMenuChange(menu.id, checked);
    if (hasChildren(menu)) {
      const selectAllChildren = childMenus => {
        childMenus.forEach(child => {
          onMenuChange(child.id, checked);
          if (child.items && child.items.length > 0) {
            selectAllChildren(child.items);
          }
        });
      };
      selectAllChildren(menu.items);
    }
  };
  const areAllChildrenSelected = menu => {
    if (!hasChildren(menu)) return false;
    return menu.items.every(child => selectedMenuIds.includes(child.id));
  };
  const areSomeChildrenSelected = menu => {
    if (!hasChildren(menu)) return false;
    return menu.items.some(child => selectedMenuIds.includes(child.id));
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "accordion"
  }, menus.map(menu => {
    const isExpanded = expandedItems.includes(menu.id);
    const children = menu.items || [];
    const allChildrenSelected = areAllChildrenSelected(menu);
    const someChildrenSelected = areSomeChildrenSelected(menu);
    return /*#__PURE__*/React.createElement("div", {
      key: menu.id,
      className: "accordion-item border-0 mb-2"
    }, /*#__PURE__*/React.createElement("div", {
      className: "accordion-header bg-light p-3 rounded border"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex align-items-center"
    }, /*#__PURE__*/React.createElement("input", {
      className: "form-check-input me-3",
      type: "checkbox",
      id: `menu-${menu.id}`,
      checked: selectedMenuIds.includes(menu.id) || allChildrenSelected,
      ref: input => {
        if (input) {
          input.indeterminate = someChildrenSelected && !allChildrenSelected && !selectedMenuIds.includes(menu.id);
        }
      },
      onChange: e => handleMenuChangeWithChildren(menu, e.target.checked)
    }), /*#__PURE__*/React.createElement("label", {
      className: "form-check-label flex-grow-1 fw-bold cursor-pointer",
      htmlFor: `menu-${menu.id}`,
      onClick: () => hasChildren(menu) && toggleItem(menu.id),
      style: {
        cursor: hasChildren(menu) ? 'pointer' : 'default',
        color: '#2c3e50'
      }
    }, menu.label, hasChildren(menu) && /*#__PURE__*/React.createElement("span", {
      className: "badge bg-primary ms-2"
    }, children.length)), hasChildren(menu) && /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "btn btn-sm btn-outline-primary",
      onClick: () => toggleItem(menu.id)
    }, isExpanded ? /*#__PURE__*/React.createElement("i", {
      className: "fas fa-chevron-up"
    }) : /*#__PURE__*/React.createElement("i", {
      className: "fas fa-chevron-down"
    })))), hasChildren(menu) && isExpanded && /*#__PURE__*/React.createElement("div", {
      className: "accordion-content mt-2 ms-3"
    }, /*#__PURE__*/React.createElement(MenuAccordion, {
      menus: children,
      selectedMenuIds: selectedMenuIds,
      onMenuChange: onMenuChange,
      level: level + 1
    }), children.length > 0 && /*#__PURE__*/React.createElement("div", {
      className: "mt-2 mb-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "btn-group btn-group-sm"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "btn btn-outline-success btn-sm",
      onClick: () => {
        children.forEach(child => {
          if (!selectedMenuIds.includes(child.id)) {
            handleMenuChangeWithChildren(child, true);
          }
        });
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-check me-1"
    }), " Todos"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "btn btn-outline-danger btn-sm",
      onClick: () => {
        children.forEach(child => {
          if (selectedMenuIds.includes(child.id)) {
            onMenuChange(child.id, false);
          }
        });
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-times me-1"
    }), " Ninguno")))));
  }));
};
export const UserRoleForm = ({
  formId,
  onHandleSubmit,
  initialData
}) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: {
      errors
    }
  } = useForm();
  const onSubmit = data => {
    const submissionData = {
      ...data,
      menus: allMenus,
      menuIds: selectedMenuIds,
      permissions: selectedPermissions
    };
    onHandleSubmit(submissionData);
  };
  const [allMenus, setAllMenus] = useState([]);
  const [permissionCategories, setPermissionCategories] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [selectedMenuIds, setSelectedMenuIds] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const menusData = await menuService.getAllMenuByRole();
        console.log("Menús jerárquicos del API:", menusData);
        setAllMenus(menusData);
        const permissionsData = await permissionService.getAll();
        setPermissionCategories(permissionsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    if (initialData) {
      console.log('Initial data received:', initialData);
      reset({
        name: initialData.name,
        group: initialData.group
      });
      setSelectedPermissions(initialData.permissions || []);
      const activeMenuIds = initialData.menuIds || initialData.menus?.filter(menu => menu.is_active).map(menu => menu.id) || [];
      setSelectedMenuIds(activeMenuIds);
      console.log('Active menu IDs:', activeMenuIds);
    } else {
      reset({
        name: '',
        group: ''
      });
      setSelectedPermissions([]);
      setSelectedMenuIds([]);
    }
  }, [initialData, reset]);
  const handleMenuChange = (menuId, checked) => {
    setSelectedMenuIds(prev => checked ? [...prev, menuId] : prev.filter(id => id !== menuId));
  };
  const handlePermissionChange = (permissionKey, checked) => {
    setSelectedPermissions(prev => checked ? [...prev, permissionKey] : prev.filter(key => key !== permissionKey));
  };
  const getAllMenuIdsFromTree = menus => {
    const ids = [];
    const traverse = menuList => {
      menuList.forEach(menu => {
        ids.push(menu.id);
        if (menu.items && menu.items.length > 0) {
          traverse(menu.items);
        }
      });
    };
    traverse(menus);
    return ids;
  };
  if (loading) {
    return /*#__PURE__*/React.createElement("div", {
      className: "container-fluid p-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-center py-5"
    }, /*#__PURE__*/React.createElement("div", {
      className: "spinner-border text-primary",
      role: "status"
    }, /*#__PURE__*/React.createElement("span", {
      className: "visually-hidden"
    }, "Cargando...")), /*#__PURE__*/React.createElement("p", {
      className: "mt-2"
    }, "Cargando men\xFAs y permisos...")));
  }
  return /*#__PURE__*/React.createElement(PrimeReactProvider, {
    value: {
      appendTo: 'self',
      zIndex: {
        overlay: 100000
      }
    }
  }, /*#__PURE__*/React.createElement("form", {
    id: formId,
    onSubmit: handleSubmit(onSubmit),
    className: "container-fluid p-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label",
    htmlFor: "name"
  }, "Nombre del Rol"), /*#__PURE__*/React.createElement(InputText, _extends({
    id: "name"
  }, register('name', {
    required: 'Nombre es requerido'
  }), {
    className: `form-control ${errors.name ? 'is-invalid' : ''}`
  })), errors.name && /*#__PURE__*/React.createElement("div", {
    className: "invalid-feedback"
  }, errors.name.message)), /*#__PURE__*/React.createElement("div", {
    className: "form-group mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label",
    htmlFor: "group"
  }, "Grupo del Rol"), /*#__PURE__*/React.createElement(Controller, {
    name: "group",
    control: control,
    rules: {
      required: 'Grupo de rol es requerido'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Dropdown, _extends({}, field, {
      options: roleGroupOptions,
      placeholder: "Seleccione grupo",
      className: `w-100 ${errors.group ? 'is-invalid' : ''}`
    }))
  }), errors.group && /*#__PURE__*/React.createElement("div", {
    className: "invalid-feedback"
  }, errors.group.message)), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-header d-flex justify-content-between align-items-center"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h5", {
    className: "mb-0"
  }, "Men\xFAs"), /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, selectedMenuIds.length, " de ", getAllMenuIdsFromTree(allMenus).length, " seleccionados"))), /*#__PURE__*/React.createElement("div", {
    className: "card-body",
    style: {
      maxHeight: '600px',
      overflowY: 'auto'
    }
  }, allMenus.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "alert alert-warning text-center"
  }, "No hay men\xFAs disponibles") : /*#__PURE__*/React.createElement(MenuAccordion, {
    menus: allMenus,
    selectedMenuIds: selectedMenuIds,
    onMenuChange: handleMenuChange
  }), /*#__PURE__*/React.createElement("div", {
    className: "mt-4 border-top pt-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center"
  }, /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, "Selecci\xF3n global:"), /*#__PURE__*/React.createElement("div", {
    className: "btn-group btn-group-sm"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-outline-success",
    onClick: () => {
      const allIds = getAllMenuIdsFromTree(allMenus);
      setSelectedMenuIds(allIds);
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-check-double me-1"
  }), " Todos"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-outline-danger",
    onClick: () => setSelectedMenuIds([])
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-times me-1"
  }), " Ninguno"))))))), /*#__PURE__*/React.createElement("div", {
    className: "col-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-header"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "mb-0"
  }, "Permisos")), /*#__PURE__*/React.createElement("div", {
    className: "card-body",
    style: {
      maxHeight: '600px',
      overflowY: 'auto'
    }
  }, permissionCategories.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "text-center text-muted py-3"
  }, "No hay categor\xEDas de permisos cargadas") : permissionCategories.map((category, index) => /*#__PURE__*/React.createElement("div", {
    key: index,
    className: "mb-4"
  }, /*#__PURE__*/React.createElement("h6", {
    className: "fw-bold text-primary border-bottom pb-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-shield-alt me-2"
  }), category.name), category.permissions.map(permission => /*#__PURE__*/React.createElement("div", {
    key: permission.key_,
    className: "form-check form-switch mb-3"
  }, /*#__PURE__*/React.createElement("input", {
    className: "form-check-input",
    type: "checkbox",
    id: permission.key_,
    checked: selectedPermissions.includes(permission.key_),
    onChange: e => handlePermissionChange(permission.key_, e.target.checked)
  }), /*#__PURE__*/React.createElement("label", {
    className: "form-check-label",
    htmlFor: permission.key_
  }, permission.name))), index < permissionCategories.length - 1 && /*#__PURE__*/React.createElement("hr", null)))))))));
};
export default UserRoleForm;