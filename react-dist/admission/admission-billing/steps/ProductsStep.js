import React from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { validateProductsStep } from "../utils/helpers.js";
import { calculateTotal } from "../utils/helpers.js";
const ProductsStep = ({
  formData,
  updateFormData,
  nextStep,
  prevStep,
  toast
}) => {
  const handleAddProduct = product => {
    // Lógica para agregar producto
  };
  const handleRemoveProduct = id => {
    updateFormData('products', formData.products.filter(p => p.id !== id));
  };
  const handleNext = () => {
    if (validateProductsStep(formData.products, toast)) {
      nextStep();
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Lista de productos",
    className: "mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-4"
  }, /*#__PURE__*/React.createElement(Dropdown, {
    placeholder: "Seleccione un producto",
    options: [{
      label: "Consulta Endocrinologia",
      value: "Consulta Endocrinologia"
    }],
    className: "w-full"
  })), /*#__PURE__*/React.createElement(DataTable, {
    value: formData.products,
    className: "p-datatable-sm"
  }, /*#__PURE__*/React.createElement(Column, {
    field: "id",
    header: "#"
  }), /*#__PURE__*/React.createElement(Column, {
    field: "description",
    header: "Descripci\xF3n del Producto"
  }), /*#__PURE__*/React.createElement(Column, {
    field: "price",
    header: "Precio"
  }), /*#__PURE__*/React.createElement(Column, {
    field: "quantity",
    header: "Cantidad"
  }), /*#__PURE__*/React.createElement(Column, {
    field: "tax",
    header: "Impuesto"
  }), /*#__PURE__*/React.createElement(Column, {
    field: "total",
    header: "Total"
  }), /*#__PURE__*/React.createElement(Column, {
    body: rowData => /*#__PURE__*/React.createElement(Button, {
      icon: "pi pi-trash",
      className: "p-button-danger p-button-sm",
      onClick: () => handleRemoveProduct(rowData.id)
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-content-end mt-3"
  }, /*#__PURE__*/React.createElement("strong", null, "Total General: ", calculateTotal(formData.products).toFixed(2))))), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-content-between pt-4 col-12"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Atr\xE1s",
    icon: "pi pi-arrow-left",
    onClick: prevStep
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Siguiente",
    icon: "pi pi-arrow-right",
    iconPos: "right",
    onClick: handleNext
  })));
};
export default ProductsStep;