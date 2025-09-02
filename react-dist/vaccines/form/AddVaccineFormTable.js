import React, { forwardRef } from "react";
import { CustomPRTable } from "../../components/CustomPRTable.js";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
export const AddVaccineFormTable = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    vaccinesFromInventory,
    onRemove,
    updateVaccine
  } = props;
  const columns = [{
    field: "name",
    header: "Nombre",
    width: "200px",
    body: rowData => rowData.name
  }, {
    field: "dose",
    header: "Dosis",
    width: "200px",
    body: rowData => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(InputNumber, {
      value: rowData.dose,
      onChange: e => updateVaccine(vaccinesFromInventory.indexOf(rowData), {
        ...rowData,
        dose: e.value
      }, "dose", e.value),
      mode: "decimal",
      showButtons: true,
      incrementButtonClassName: "btn-primary",
      decrementButtonClassName: "btn-primary",
      incrementButtonIcon: /*#__PURE__*/React.createElement("i", {
        className: "fa fa-plus"
      }),
      decrementButtonIcon: /*#__PURE__*/React.createElement("i", {
        className: "fa fa-minus"
      }),
      inputMode: "numeric",
      min: 1,
      max: 999,
      className: "w-100",
      inputClassName: "w-100",
      placeholder: "Ej: 1"
    }))
  }, {
    field: "scheme",
    header: "Esquema",
    width: "200px",
    body: rowData => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(InputText, {
      value: rowData.scheme,
      onChange: e => updateVaccine(vaccinesFromInventory.indexOf(rowData), {
        ...rowData,
        scheme: e.target.value
      }, "scheme", e.target.value),
      className: "w-100",
      placeholder: "Ej: 0-6 meses"
    }))
  }, {
    field: "booster",
    header: "Refuerzo",
    width: "200px",
    body: rowData => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(InputText, {
      value: rowData.booster,
      onChange: e => updateVaccine(vaccinesFromInventory.indexOf(rowData), {
        ...rowData,
        booster: e.target.value
      }, "booster", e.target.value),
      className: "w-100",
      placeholder: "Ej: Anual"
    }))
  }, {
    field: "actions",
    header: "Acciones",
    body: rowData => /*#__PURE__*/React.createElement("div", {
      className: "d-flex align-items-center justify-content-center"
    }, /*#__PURE__*/React.createElement(Button, {
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa fa-trash"
      }),
      rounded: true,
      text: true,
      severity: "danger",
      onClick: () => onRemove({
        data: rowData,
        index: vaccinesFromInventory.indexOf(rowData)
      })
    }))
  }];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(CustomPRTable, {
    data: vaccinesFromInventory,
    disableReload: true,
    disableSearch: true,
    columns: columns
  }));
});