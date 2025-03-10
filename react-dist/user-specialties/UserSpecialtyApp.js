import React, { useState } from 'react';
import { ConfigDropdownMenu } from "../config/components/ConfigDropdownMenu.js";
import { UserAvailabilityTable } from "../user-availabilities/components/UserAvailabilityTable.js";
import UserAvailabilityFormModal from "../user-availabilities/components/UserAvailabilityFormModal.js";
import { PrimeReactProvider } from 'primereact/api';
export const UserSpecialtyApp = () => {
  const [showFormModal, setShowFormModal] = useState(false);
  const handleSubmit = e => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(Array.from(formData.entries()));
    console.log(data);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PrimeReactProvider, null, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-4"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "mb-1"
  }, "Horarios de Atenci\xF3n"), /*#__PURE__*/React.createElement("div", {
    className: "text-end mb-2"
  }, /*#__PURE__*/React.createElement(ConfigDropdownMenu, {
    title: "Nuevo",
    onItemClick: (e, item) => {
      if (item.target === '#modalCreateUserOpeningHour') {
        setShowFormModal(true);
      }
    }
  }))), /*#__PURE__*/React.createElement(UserAvailabilityTable, null), /*#__PURE__*/React.createElement(UserAvailabilityFormModal, {
    show: showFormModal,
    handleSubmit: handleSubmit,
    onHide: () => {
      setShowFormModal(false);
    }
  })));
};