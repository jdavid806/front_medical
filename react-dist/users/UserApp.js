import React, { useEffect, useState } from "react";
import UserTable from "./UserTable.js";
import UserFormModal from "./UserFormModal.js";
import { PrimeReactProvider } from "primereact/api";
import { useUserCreate } from "./hooks/useUserCreate.php.js";
import { useUserUpdate } from "./hooks/useUserUpdate.js";
import { useUser } from "./hooks/useUser.js";
import { useActivateOtp } from "./hooks/useActivateOtp.js";
import { useAllTableUsers } from "./hooks/useAllTableUsers.js";
export const UserApp = ({
  onConfigurationComplete,
  isConfigurationContext = false
}) => {
  const [showUserFormModal, setShowUserFormModal] = useState(false);
  const [initialData, setInitialData] = useState(undefined);
  const [initialUserFormConfig] = useState({
    credentials: {
      visible: true
    }
  });
  const [userFormConfig, setUserFormConfig] = useState(initialUserFormConfig);
  const {
    createUser
  } = useUserCreate();
  const {
    updateUser
  } = useUserUpdate();
  const {
    user,
    setUser,
    fetchUser
  } = useUser();
  const {
    activateOtp,
    loading: otpLoading
  } = useActivateOtp();
  const {
    users,
    loading,
    error,
    refreshUsers
  } = useAllTableUsers();

  // Validar si hay al menos un usuario configurado
  useEffect(() => {
    const hasUsers = users && users.length > 0;
    onConfigurationComplete?.(hasUsers);
  }, [users, onConfigurationComplete]);
  const isComplete = users && users.length > 0;
  const showValidations = isConfigurationContext;

  // ✅ AGREGAR ESTA FUNCIÓN FALTANTE
  const onCreate = () => {
    setInitialData(undefined);
    setUserFormConfig(initialUserFormConfig);
    setUser(null);
    setShowUserFormModal(true);
  };
  const handleOtpChange = async (enabled, email) => {
    const otpData = {
      email: email,
      otp_enabled: enabled
    };
    await activateOtp(otpData);
  };
  const handleSubmit = async data => {
    const finalData = {
      ...data,
      user_specialty_id: data.user_specialty_id === null || data.user_specialty_id === 0 ? 1 : data.user_specialty_id
    };
    try {
      if (user) {
        //@ts-ignore
        let minioUrl = await guardarArchivoUsuario("uploadImageConfigUsers", user.id);
        await updateUser(user.id, {
          ...finalData,
          minio_url: minioUrl
        });
      } else {
        const res = await createUser(finalData);
        //@ts-ignore
        let minioUrl = await guardarArchivoUsuario("uploadImageConfigUsers", res.data.id);
        await updateUser(res.data.id, {
          minio_url: minioUrl
        });
      }

      // ✅ CORREGIDO: Usar refreshUsers en lugar de fetchUsers
      await refreshUsers();
      handleOtpChange(data.otp_enabled, data.email);
      setShowUserFormModal(false);
    } catch (error) {
      console.error(error);
    }
  };
  const handleHideUserFormModal = () => {
    setShowUserFormModal(false);
  };
  const handleTableEdit = id => {
    fetchUser(id);
    setShowUserFormModal(true);
    setUserFormConfig({
      credentials: {
        visible: false
      }
    });
  };
  useEffect(() => {
    if (user) {
      setInitialData({
        username: "",
        email: user.email || "",
        password: "",
        first_name: user.first_name || "",
        middle_name: user.middle_name || "",
        last_name: user.last_name || "",
        second_last_name: user.second_last_name || "",
        user_role_id: +user.user_role_id || 0,
        user_specialty_id: +user.user_specialty_id || 0,
        country_id: user?.country_id.toString() || "",
        city_id: user?.city_id.toString() || "",
        gender: user.gender || "",
        address: user.address || "",
        phone: user.phone || "",
        minio_id: user.minio_id || "",
        minio_url: user.minio_url || "",
        clinical_record: user.clinical_record || "",
        otp_enabled: user.otp_enabled || false
      });
    }
  }, [user]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PrimeReactProvider, {
    value: {
      appendTo: "self",
      zIndex: {
        overlay: 100000
      }
    }
  }, showValidations && /*#__PURE__*/React.createElement("div", {
    className: "validation-section mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: `alert ${isComplete ? "alert-success" : "alert-info"} p-3`
  }, /*#__PURE__*/React.createElement("i", {
    className: `${isComplete ? "pi pi-check-circle" : "pi pi-info-circle"} me-2`
  }), isComplete ? "¡Roles configurados correctamente! Puede continuar al siguiente módulo." : 'Configure al menos un rol de usuario para habilitar el botón "Siguiente Módulo"')), error && /*#__PURE__*/React.createElement("div", {
    className: "alert alert-danger",
    role: "alert"
  }, error), /*#__PURE__*/React.createElement(UserTable, {
    users: users,
    onReload: refreshUsers,
    onEditItem: handleTableEdit,
    loading: loading,
    onCreateUser: onCreate
  }), /*#__PURE__*/React.createElement(UserFormModal, {
    title: "Crear usuario",
    show: showUserFormModal,
    handleSubmit: handleSubmit,
    onHide: handleHideUserFormModal,
    initialData: initialData,
    config: userFormConfig
  })));
};