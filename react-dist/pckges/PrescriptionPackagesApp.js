import React, { useRef, useState } from "react";
import { Button } from "primereact/button";
import { PrescriptionPackagesFormModal } from "./PrescriptionPackagesFormModal.js";
import { PrescriptionPackagesTable } from "./PrescriptionPackagesTable.js";
import { useDeletePrescriptionPackage } from "./hooks/useDeletePrescriptionPackage.js";
export const PrescriptionPackagesApp = () => {
  const {
    deletePrescriptionPackage
  } = useDeletePrescriptionPackage();
  const [selectedItem, setSelectedItem] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const tableRef = useRef(null);
  const handleTableDelete = async item => {
    const confirmed = await deletePrescriptionPackage(item.id);
    if (confirmed) tableRef.current?.fetchData();
  };
  const handleFormSave = () => {
    setShowFormModal(false);
    tableRef.current?.fetchData();
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between gap-3 mb-3"
  }, /*#__PURE__*/React.createElement("h2", null, "Paquetes"), /*#__PURE__*/React.createElement(Button, {
    label: "Agregar nuevo paquete",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-plus me-2"
    }),
    className: "btn btn-primary",
    onClick: () => setShowFormModal(true)
  })), /*#__PURE__*/React.createElement(PrescriptionPackagesTable, {
    onEdit: item => {
      setSelectedItem(item);
      setShowFormModal(true);
    },
    onDelete: handleTableDelete,
    ref: tableRef
  }), /*#__PURE__*/React.createElement(PrescriptionPackagesFormModal, {
    packageId: selectedItem?.id,
    visible: showFormModal,
    onHide: () => {
      setShowFormModal(false);
      setSelectedItem(null);
    },
    onSave: handleFormSave
  }));
};