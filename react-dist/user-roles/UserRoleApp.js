import React, { useState } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import { useEffect } from 'react';
import { useUserRole } from "./hooks/useUserRole.js";
import { useUserRoleDelete } from "./hooks/useUserRoleDelete.js";
import { useRoles } from "./hooks/useUserRoles.js";
import { UserRoleTable } from "./components/UserRoleTable.js";
import { UserRoleFormModal } from "./components/UserRoleFormModal.js";
import { useUserRoleCreate } from "./hooks/useUserRoleUpdate.js";
import { useUserRoleUpdate } from "./hooks/useUserRoleCreate.js";
export const UserRoleApp = () => {
  const [showFormModal, setShowFormModal] = useState(false);
  const [initialData, setInitialData] = useState(undefined);
  const {
    userRoles,
    fetchUserRoles
  } = useRoles();
  const {
    createUserRole
  } = useUserRoleCreate();
  const {
    updateUserRole
  } = useUserRoleUpdate();
  const {
    deleteUserRole
  } = useUserRoleDelete();
  const {
    userRole,
    fetchUserRole,
    setUserRole
  } = useUserRole();
  const onCreate = () => {
    setInitialData(undefined);
    setShowFormModal(true);
  };
  const handleSubmit = async data => {
    try {
      if (userRole) {
        // Actualizar rol existente (incluye menús y permisos)
        await updateUserRole(userRole.id, data);
      } else {
        // Crear nuevo rol (incluye menús y permisos)
        await createUserRole(data);
      }
      fetchUserRoles();
      setShowFormModal(false);
      setUserRole(null);
    } catch (error) {
      console.error('Error al guardar rol:', error);
    }
  };
  const handleTableEdit = id => {
    fetchUserRole(id);
    setShowFormModal(true);
  };
  const handleTableDelete = async id => {
    const confirmed = await deleteUserRole(id);
    if (confirmed) fetchUserRoles();
  };
  useEffect(() => {
    if (userRole) {
      setInitialData({
        name: userRole.name || '',
        group: userRole.group || '',
        permissions: userRole.permissions?.map(permission => permission.key) || [],
        menus: userRole.menus?.map(item => ({
          id: item.id,
          key_: item.key,
          name: item.label,
          is_active: item.is_active,
          pivot: item.pivot
        })) || [],
        menuIds: userRole.menus?.map(menu => menu.id) || []
      });
    } else {
      setInitialData(undefined);
    }
  }, [userRole]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PrimeReactProvider, {
    value: {
      appendTo: 'self',
      zIndex: {
        overlay: 100000
      }
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-4"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "mb-1"
  }, "Roles de Usuario"), /*#__PURE__*/React.createElement("div", {
    className: "text-end mb-2"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: onCreate
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-plus"
  }), " Nuevo"))), /*#__PURE__*/React.createElement(UserRoleTable, {
    userRoles: userRoles,
    onEditItem: handleTableEdit,
    onDeleteItem: handleTableDelete
  }), /*#__PURE__*/React.createElement(UserRoleFormModal, {
    title: userRole ? 'Editar rol de Usuario' : 'Crear rol de Usuario',
    show: showFormModal,
    handleSubmit: handleSubmit,
    onHide: () => {
      setShowFormModal(false);
      setUserRole(null);
    },
    initialData: initialData
  })));
};