import React from "react";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { PrescriptionPackagesForm } from "./PrescriptionPackagesForm.js";
import { useRef } from "react";
import { useCreatePrescriptionPackage } from "./hooks/useCreatePrescriptionPackage.js";
import { useUpdatePrescriptionPackage } from "./hooks/useUpdatePrescriptionPackage.js";
import { Toast } from "primereact/toast";
export const PrescriptionPackagesFormModal = props => {
  const {
    visible,
    onHide,
    onSave,
    packageId
  } = props;
  const {
    createPrescriptionPackage,
    toast: createToast
  } = useCreatePrescriptionPackage();
  const {
    updatePrescriptionPackage,
    toast: updateToast
  } = useUpdatePrescriptionPackage();
  const formRef = useRef(null);
  const handleSave = async () => {
    const formData = formRef.current?.getFormData();
    if (!formData) return;
    console.log('formData', formData);
    try {
      if (packageId) {
        await updatePrescriptionPackage(packageId, formData);
      } else {
        await createPrescriptionPackage(formData);
      }
      formRef.current?.resetForm();
      onSave();
      onHide();
    } catch (error) {
      console.log(error);
    }
  };
  const handleHide = () => {
    formRef.current?.resetForm();
    onHide();
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Dialog, {
    visible: visible,
    onHide: handleHide,
    header: "Nuevo paquete",
    style: {
      width: '90vw'
    },
    dismissableMask: true,
    draggable: false,
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Toast, {
      ref: createToast
    }), /*#__PURE__*/React.createElement(Toast, {
      ref: updateToast
    }), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-end gap-2"
    }, /*#__PURE__*/React.createElement(Button, {
      label: "Cancelar",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fas fa-times me-2"
      }),
      className: "btn btn-danger",
      onClick: handleHide,
      type: "button"
    }), /*#__PURE__*/React.createElement(Button, {
      label: "Guardar",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fas fa-save me-2"
      }),
      className: "btn btn-primary",
      type: "button",
      onClick: handleSave
    })))
  }, /*#__PURE__*/React.createElement(PrescriptionPackagesForm, {
    packageId: packageId,
    ref: formRef
  })));
};