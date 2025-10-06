import React from "react";
import { CustomModal } from "../../../components/CustomModal.js";
import AdvanceHistoryForm from "./FormAdvanceHistory.js";
import { Button } from "primereact/button";
const AdvanceHistoryModal = ({
  show,
  customerId,
  invoiceTotal,
  onSelectAdvances,
  onHide
}) => {
  const handleConfirmSelection = selectedAdvances => {
    onSelectAdvances(selectedAdvances);
    if (onHide) onHide();
  };
  return /*#__PURE__*/React.createElement(CustomModal, {
    show: show,
    onHide: onHide,
    title: "Anticipos del Cliente",
    size: "lg",
    footer: /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
      label: "Cancelar",
      icon: "pi pi-times",
      onClick: onHide,
      className: "p-button-text"
    }), /*#__PURE__*/React.createElement(Button, {
      label: "Aplicar anticipos",
      icon: "pi pi-check",
      onClick: () => handleConfirmSelection,
      disabled: false // La validación se maneja en el formulario
    }))
  }, /*#__PURE__*/React.createElement(AdvanceHistoryForm, {
    customerId: customerId,
    invoiceTotal: invoiceTotal,
    onSelectAdvances: handleConfirmSelection
  }));
};
export default AdvanceHistoryModal;