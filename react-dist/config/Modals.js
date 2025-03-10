import React, { useState } from 'react';
import UserFormModal from "../users/UserFormModal.js";
const Modals = ({
  show,
  onHide,
  title,
  children
}) => {
  const [showUserFormModal, setShowUserFormModal] = useState(false);
  const handleUserFormSubmit = () => {};
  return /*#__PURE__*/React.createElement(UserFormModal, {
    show: showUserFormModal,
    handleSubmit: handleUserFormSubmit
  });
};
export default Modals;