import React, { useState } from 'react';
import { ConfigDropdownMenu } from "../config/components/ConfigDropdownMenu.js";
import { UserAvailabilityTable } from "./components/UserAvailabilityTable.js";
import UserAvailabilityFormModal from "./components/UserAvailabilityFormModal.js";
import { PrimeReactProvider } from 'primereact/api';
export const UserAvailabilityApp = () => {
  const [showFormModal, setShowFormModal] = useState(false);
  const handleSubmit = data => {
    console.log(data);
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