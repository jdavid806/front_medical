import React, { useEffect, useState } from "react";
import UserTable from "./UserTable.js";
import UserFormModal from "./UserFormModal.js";
import { PrimeReactProvider } from "primereact/api";
import { useUserCreate } from "./hooks/useUserCreate.php.js";
import { useAllTableUsers } from "./hooks/useAllTableUsers.js";
import { useUserUpdate } from "./hooks/useUserUpdate.js";
import { useUser } from "./hooks/useUser.js";
export const UserApp = () => {
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
    users,
    fetchUsers
  } = useAllTableUsers();
  const onCreate = () => {
    setInitialData(undefined);
    setUserFormConfig(initialUserFormConfig);
    setUser(null);
    setShowUserFormModal(true);
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
        console.log("minioUrl", minioUrl);
        await updateUser(user.id, {
          ...finalData,
          minio_url: minioUrl
        });
      } else {
        const res = await createUser(finalData);
        //@ts-ignore
        let minioUrl = await guardarArchivoUsuario("uploadImageConfigUsers", res.id);
        await updateUser(res.id, {
          minio_url: minioUrl
        });
      }
      fetchUsers();
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
        clinical_record: user.clinical_record || ""
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
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-4"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "mb-1"
  }, "Usuarios"), /*#__PURE__*/React.createElement("div", {
    className: "text-end mb-2"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary d-flex align-items-center",
    onClick: onCreate
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-plus me-2"
  }), "Nuevo"))), /*#__PURE__*/React.createElement(UserTable, {
    users: users,
    onEditItem: handleTableEdit
  }), /*#__PURE__*/React.createElement(UserFormModal, {
    title: "Crear usuario",
    show: showUserFormModal,
    handleSubmit: handleSubmit,
    onHide: handleHideUserFormModal,
    initialData: initialData,
    config: userFormConfig
  })));
};