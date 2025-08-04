import React from "react";
import { CustomModal } from "../../../components/CustomModal.js";
import { OptometryBillingForm } from "../form/OptometryBillingForm.js";
export const OptometryBillingModal = ({
  receiptId,
  show,
  onHide,
  onSaveSuccess
}) => {
  const handleSaveSuccess = () => {
    if (onSaveSuccess) onSaveSuccess();
    onHide();
  };
  return /*#__PURE__*/React.createElement(CustomModal, {
    show: show,
    onHide: onHide,
    title: "Facturaci\xF3n de optometr\xEDa"
  }, /*#__PURE__*/React.createElement(OptometryBillingForm, {
    receiptId: receiptId
  }));
};