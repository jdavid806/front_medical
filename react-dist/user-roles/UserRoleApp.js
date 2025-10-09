import React, { useState, useEffect } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import { useUserRole } from "./hooks/useUserRole.js";
import { useUserRoleDelete } from "./hooks/useUserRoleDelete.js";
import { useRoles } from "./hooks/useUserRoles.js";
import { UserRoleTable } from "./components/UserRoleTable.js";
import { UserRoleFormModal } from "./components/UserRoleFormModal.js";
import { useUserRoleCreate } from "./hooks/useUserRoleUpdate.js";
import { useUserRoleUpdate } from "./hooks/useUserRoleCreate.js";
export const UserRoleApp = ({
  onConfigurationComplete,
  isConfigurationContext = false
}) => {
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

  // Determinar si está completo
  const isComplete = userRoles && userRoles.length > 0;
  const showValidations = isConfigurationContext;
  useEffect(() => {
    onConfigurationComplete?.(isComplete);
  }, [userRoles, onConfigurationComplete, isComplete]);
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
  }, showValidations && /*#__PURE__*/React.createElement("div", {
    className: "validation-section mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: `alert ${isComplete ? 'alert-success' : 'alert-info'} p-3`
  }, /*#__PURE__*/React.createElement("i", {
    className: `${isComplete ? 'pi pi-check-circle' : 'pi pi-info-circle'} me-2`
  }), isComplete ? '¡Roles configurados correctamente! Puede continuar al siguiente módulo.' : 'Configure al menos un rol de usuario para habilitar el botón "Siguiente Módulo"')), /*#__PURE__*/React.createElement("div", {
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