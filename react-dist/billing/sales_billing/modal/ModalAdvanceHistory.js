import React from "react";
import { CustomModal } from "../../../components/CustomModal.js";
import AdvanceHistoryForm from "./FormAdvanceHistory.js";
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
    title: "Anticipos del Cliente"
  }, /*#__PURE__*/React.createElement(AdvanceHistoryForm, {
    customerId: customerId,
    invoiceTotal: invoiceTotal,
    onSelectAdvances: handleConfirmSelection
  }));
};
export default AdvanceHistoryModal;