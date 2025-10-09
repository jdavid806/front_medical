import React, { useState, useEffect } from 'react';
import { ConfigDropdownMenu } from "../config/components/ConfigDropdownMenu.js";
import { UserAvailabilityTable } from "../user-availabilities/components/UserAvailabilityTable.js";
import UserAvailabilityFormModal from "../user-availabilities/components/UserAvailabilityFormModal.js";
import { PrimeReactProvider } from 'primereact/api';
export const UserSpecialtyApp = ({
  onConfigurationComplete,
  isConfigurationContext = false
}) => {
  const [showFormModal, setShowFormModal] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [availabilities, setAvailabilities] = useState([]);
  useEffect(() => {
    const hasAvailabilities = availabilities && availabilities.length > 0;
    setIsComplete(hasAvailabilities);
    onConfigurationComplete?.(hasAvailabilities);
  }, [availabilities, onConfigurationComplete]);
  const handleSubmit = e => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(Array.from(formData.entries()));
    console.log(data);
  };
  const showValidations = isConfigurationContext;
  return /*#__PURE__*/React.createElement(React.Fragment, null, showValidations && /*#__PURE__*/React.createElement("div", {
    className: "validation-section mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: `alert ${isComplete ? 'alert-success' : 'alert-info'} p-3`
  }, /*#__PURE__*/React.createElement("i", {
    className: `${isComplete ? 'pi pi-check-circle' : 'pi pi-info-circle'} me-2`
  }), isComplete ? '¡Horarios configurados correctamente! Puede continuar al siguiente módulo.' : 'Configure al menos un horario de atención para habilitar el botón "Siguiente Módulo"')), /*#__PURE__*/React.createElement(PrimeReactProvider, null, /*#__PURE__*/React.createElement("div", {
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
  }))), /*#__PURE__*/React.createElement(UserAvailabilityTable, {
    onDataChange: setAvailabilities
  }), /*#__PURE__*/React.createElement(UserAvailabilityFormModal, {
    show: showFormModal,
    handleSubmit: handleSubmit,
    onHide: () => {
      setShowFormModal(false);
    }
  })));
};