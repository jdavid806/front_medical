import React, { forwardRef, useImperativeHandle } from "react";
import { Button } from "primereact/button";
import { CustomPRTable } from "../components/CustomPRTable.js";
import { useClinicalPackages } from "../clinical-packages/hooks/useClinicalPackages.js";
export const PrescriptionPackagesTable = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    onEdit,
    onDelete
  } = props;
  const {
    clinicalPackages,
    fetchClinicalPackages,
    loading: clinicalPackagesLoading
  } = useClinicalPackages();
  useImperativeHandle(ref, () => ({
    fetchData: fetchClinicalPackages
  }));
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
        className: "fas fa-edit me-2"
      }),
      className: "btn btn-primary",
      onClick: () => onEdit(data)
    }), /*#__PURE__*/React.createElement(Button, {
      label: "Eliminar",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fas fa-trash me-2"
      }),
      className: "btn btn-danger",
      onClick: () => onDelete(data)
    }))
  }];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(CustomPRTable, {
    columns: columns,
    data: clinicalPackages,
    onReload: fetchClinicalPackages,
    loading: clinicalPackagesLoading
  }));
});