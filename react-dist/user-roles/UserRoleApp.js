import React, { useState, useEffect } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import { useUserRole } from "./hooks/useUserRole.js";
import { useUserRoleDelete } from "./hooks/useUserRoleDelete.js";
import { useUserRoles } from "./hooks/useUserRoles.js";
import { UserRoleTable } from "./components/UserRoleTable.js";
import { UserRoleFormModal } from "./components/UserRoleFormModal.js";
import { useUserRoleCreate } from "./hooks/useUserRoleCreate.js";
import { useUserRoleUpdate } from "./hooks/useUserRoleUpdate.js";
import { userRolesService } from "../../services/api/index.js";
import { SwalManager } from "../../services/alertManagerImported.js";
export const UserRoleApp = ({
  onConfigurationComplete,
  isConfigurationContext = false
}) => {
  const [showFormModal, setShowFormModal] = useState(false);
  const [initialData, setInitialData] = useState(undefined);
  const [editingRoleId, setEditingRoleId] = useState(undefined);
  const {
    userRoles,
    fetchUserRoles
  } = useUserRoles();
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
  const isComplete = userRoles && userRoles.length > 0;
  const showValidations = isConfigurationContext;
  useEffect(() => {
    onConfigurationComplete?.(isComplete);
  }, [userRoles, onConfigurationComplete, isComplete]);
  const onCreate = () => {
    setInitialData(undefined);
    setEditingRoleId(undefined);
    setShowFormModal(true);
  };
  const handleSubmit = async data => {
    console.log("Datos del formulario:", data);
    try {
      if (userRole) {
        console.log("Editando rol existente:", userRole.id);
        await updateUserRole(userRole.id, data);
        const payload = {
          "group": data.group,
          "is_active": true
        };
        await userRolesService.updateGroupRole(userRole.id, payload);
      } else {
        console.log("Creando nuevo rol");
        const createPayload = {
          "name": data.name,
          "group": data.group,
          "is_active": true
        };
        await userRolesService.createRoleUserMenu(createPayload);
        SwalManager.success();
        console.log("Rol básico creado exitosamente");
      }
      fetchUserRoles();
      setShowFormModal(false);
      setUserRole(null);
      setEditingRoleId(undefined);
    } catch (error) {
      console.error('Error al guardar rol:', error);
    }
  };
  const handleTableEdit = id => {
    fetchUserRole(id);
    setEditingRoleId(Number(id));
    setShowFormModal(true);
  };
  const handleTableDelete = async id => {
    const confirmed = await deleteUserRole(id);
    if (confirmed) {
      SwalManager.success();
      fetchUserRoles();
    }
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
  }), isComplete ? '¡Roles configurados correctamente! Puede continuar al siguiente módulo.' : 'Configure al menos un rol de usuario para habilitar el botón "Siguiente Módulo"')), /*#__PURE__*/React.createElement(UserRoleTable, {
    userRoles: userRoles,
    onEditItem: handleTableEdit,
    onDeleteItem: handleTableDelete,
    onReload: fetchUserRoles,
    onCreateRole: onCreate,
    loading: false
  }), /*#__PURE__*/React.createElement(UserRoleFormModal, {
    title: userRole ? 'Editar rol de Usuario' : 'Crear rol de Usuario',
    show: showFormModal,
    handleSubmit: handleSubmit,
    onHide: () => {
      setShowFormModal(false);
      setUserRole(null);
      setEditingRoleId(undefined);
    },
    initialData: initialData,
    roleId: editingRoleId
  })));
};