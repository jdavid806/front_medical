import React, { useState } from "react";
import { Button } from "primereact/button";
import { CustomPRTable } from "../components/CustomPRTable.js";
import { useClinicalPackages } from "../clinical-packages/hooks/useClinicalPackages.js";
import { PrescriptionPackagesFormModal } from "./PrescriptionPackagesFormModal.js";
export const PrescriptionPackagesApp = () => {
  const {
    clinicalPackages,
    fetchClinicalPackages,
    loading: clinicalPackagesLoading
  } = useClinicalPackages();
  const [selectedItem, setSelectedItem] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const columns = [{
    field: 'label',
    header: 'Nombre'
  }, {
    field: 'description',
    header: 'Descripción'
  }, {
    field: 'actions',
    header: 'Acciones',
    body: data => /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2"
    }, /*#__PURE__*/React.createElement(Button, {
      label: "Editar",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fas fa-edit"
      }),
      className: "btn btn-primary",
      onClick: () => {
        setSelectedItem(data);
        setShowFormModal(true);
      }
    }), /*#__PURE__*/React.createElement(Button, {
      label: "Eliminar",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fas fa-trash"
      }),
      className: "btn btn-danger",
      onClick: () => setSelectedItem(data)
    }))
  }];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between gap-3 mb-3"
  }, /*#__PURE__*/React.createElement("h2", null, "Paquetes"), /*#__PURE__*/React.createElement(Button, {
    label: "Agregar nuevo paquete",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-plus me-2"
    }),
    className: "btn btn-primary",
    onClick: () => setShowFormModal(true)
  })), /*#__PURE__*/React.createElement(CustomPRTable, {
    columns: columns,
    data: clinicalPackages,
    onReload: fetchClinicalPackages,
    loading: clinicalPackagesLoading
  }), /*#__PURE__*/React.createElement(PrescriptionPackagesFormModal, {
    packageId: selectedItem?.id,
    visible: showFormModal,
    onHide: () => setShowFormModal(false)
  }));
};