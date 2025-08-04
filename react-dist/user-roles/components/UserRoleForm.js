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
}
// { label: 'Indeterminado', value: 'INDETERMINATE' }
];
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
      menus: selectedMenus,
      permissions: selectedPermissions
    };
    onHandleSubmit(submissionData);
  };
  const [menus, setMenus] = useState([]);
  const [permissionCategories, setPermissionCategories] = useState([]);
  const [selectedMenus, setSelectedMenus] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const menusData = await menuService.getAll();
        const permissionsData = await permissionService.getAll();
        setMenus(menusData);
        setPermissionCategories(permissionsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    if (initialData) {
      reset(initialData);
      setSelectedMenus(initialData.menus);
      setSelectedPermissions(initialData.permissions);
    } else {
      reset({
        name: '',
        group: '',
        permissions: [],
        menus: []
      });
      setSelectedMenus([]);
      setSelectedPermissions([]);
    }
  }, [initialData, reset]);
  const handleMenuChange = (menuKey, checked) => {
    setSelectedMenus(prev => checked ? [...prev, menuKey] : prev.filter(key => key !== menuKey));
  };
  const handlePermissionChange = (permissionKey, checked) => {
    setSelectedPermissions(prev => checked ? [...prev, permissionKey] : prev.filter(key => key !== permissionKey));
  };
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
    className: "card-header"
  }, /*#__PURE__*/React.createElement("h5", null, "Men\xFAs")), /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, menus.map(menu => /*#__PURE__*/React.createElement("div", {
    key: menu.key_,
    className: "form-check form-switch mb-3"
  }, /*#__PURE__*/React.createElement("input", {
    className: "form-check-input",
    type: "checkbox",
    id: menu.key_,
    checked: selectedMenus.includes(menu.key_),
    onChange: e => handleMenuChange(menu.key_, e.target.checked)
  }), /*#__PURE__*/React.createElement("label", {
    className: "form-check-label",
    htmlFor: menu.key_
  }, menu.name)))))), /*#__PURE__*/React.createElement("div", {
    className: "col-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-header"
  }, /*#__PURE__*/React.createElement("h5", null, "Permisos")), /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, permissionCategories.map((category, index) => /*#__PURE__*/React.createElement("div", {
    key: index
  }, /*#__PURE__*/React.createElement("h5", null, category.name), category.permissions.map(permission => /*#__PURE__*/React.createElement("div", {
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
  }, permission.name))), /*#__PURE__*/React.createElement("hr", null)))))))));
};