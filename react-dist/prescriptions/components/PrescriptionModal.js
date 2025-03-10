import React, { useRef } from 'react';
import { CustomModal } from "../../components/CustomModal.js";
import PrescriptionForm from "./PrescriptionForm.js";
const PrescriptionModal = ({
  title,
  show,
  handleSubmit,
  onHide,
  initialData
}) => {
  const formId = 'createReceta';
  const prescriptionFormRef = useRef(null);
  return /*#__PURE__*/React.createElement(CustomModal, {
    show: show,
    onHide: onHide,
    title: title,
    footerTemplate: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "btn btn-primary",
      onClick: () => {
        if (prescriptionFormRef.current) {
          const data = prescriptionFormRef.current.getFormData();
          handleSubmit(data);
        }
      }
    }, "Guardar"))
  }, /*#__PURE__*/React.createElement(PrescriptionForm, {
    ref: prescriptionFormRef,
    formId: formId,
    handleSubmit: handleSubmit,
    initialData: initialData
  }));
};
export default PrescriptionModal;