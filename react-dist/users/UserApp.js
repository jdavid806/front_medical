import React, { useState } from 'react';
import UserTable from "./UserTable.js";
import UserFormModal from "./UserFormModal.js";
import { PrimeReactProvider } from 'primereact/api';
import { useUserCreate } from './hooks/useUserCreate.php.js';
export const UserApp = () => {
  const [showUserFormModal, setShowUserFormModal] = useState(false);
  const {
    createUser
  } = useUserCreate();
  const handleSubmit = data => {
    createUser(data);
  };
  const handleOpenUserFormModal = () => {
    setShowUserFormModal(true);
  };
  const handleHideUserFormModal = () => {
    setShowUserFormModal(false);
  };
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
  }, "Usuarios"), /*#__PURE__*/React.createElement("div", {
    className: "text-end mb-2"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary d-flex align-items-center",
    onClick: handleOpenUserFormModal
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-plus me-2"
  }), "Nuevo"))), /*#__PURE__*/React.createElement(UserTable, null), /*#__PURE__*/React.createElement(UserFormModal, {
    show: showUserFormModal,
    handleSubmit: handleSubmit,
    onHide: handleHideUserFormModal
  })));
};