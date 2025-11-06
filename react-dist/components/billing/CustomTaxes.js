import React, { useEffect } from "react";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
export const CustomTaxes = ({
  subtotal,
  totalDiscount,
  taxes,
  onTaxesChange,
  productsArray,
  taxOptions
}) => {
  const calculateBaseAmount = () => {
    return (subtotal || 0) - (totalDiscount || 0);
  };
  const calculateTaxValue = taxItem => {
    const base = calculateBaseAmount();
    if (taxItem.tax && taxItem.tax.specificLogic) {
      const productsFiltered = productsArray.filter(item => item.taxChargeId === taxItem.tax.id).reduce((total, product) => {
        const productSubtotal = product.quantity * product.price;
        let discount = 0;
        if (product.discountType === "percentage") {
          discount = productSubtotal * (product.discount / 100);
        } else {
          discount = product.discount;
        }
        const subtotalAfterDiscount = productSubtotal - discount;
        return total + subtotalAfterDiscount;
      }, 0);
      return productsFiltered * (taxItem.percentage || 0) / 100;
    }
    return base * (taxItem.percentage || 0) / 100;
  };
  const handleAddTax = () => {
    const newTax = {
      id: generateId(),
      tax: null,
      percentage: 0,
      value: 0
    };
    onTaxesChange([...taxes, newTax]);
  };
  const handleRemoveTax = id => {
    onTaxesChange(taxes.filter(t => t.id !== id));
  };
  const handleTaxChange = (id, field, value) => {
    const updatedTaxes = taxes.map(taxItem => {
      if (taxItem.id === id) {
        const updatedTax = {
          ...taxItem,
          [field]: value
        };
        if (field === "tax" && value) {
          updatedTax.percentage = value.percentage;
          updatedTax.value = calculateTaxValue({
            ...updatedTax,
            percentage: value.percentage
          });
        }
        if (field === "percentage") {
          updatedTax.value = calculateTaxValue(updatedTax);
        }
        return updatedTax;
      }
      return taxItem;
    });
    onTaxesChange(updatedTaxes);
  };
  useEffect(() => {
    const updatedTaxes = taxes.map(taxItem => ({
      ...taxItem,
      value: calculateTaxValue(taxItem)
    }));
    onTaxesChange(updatedTaxes);
  }, [subtotal, totalDiscount]);
  return /*#__PURE__*/React.createElement("div", {
    className: "card mb-4 shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-header bg-light d-flex justify-content-between align-items-center"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "h5 mb-0"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-chart-line me-2 text-primary"
  }), "Impuestos Adicionales (DOP)"), /*#__PURE__*/React.createElement(Button, {
    type: "button",
    label: "Agregar impuesto",
    className: "p-btn-primary",
    onClick: handleAddTax
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-donate",
    style: {
      marginLeft: "10px"
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "taxes-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("strong", null, "Base para impuestos:"), " ", /*#__PURE__*/React.createElement(InputNumber, {
    value: calculateBaseAmount(),
    mode: "currency",
    currency: "DOP",
    locale: "es-DO",
    readOnly: true,
    className: "ml-2"
  }), /*#__PURE__*/React.createElement("small", {
    className: "d-block text-muted mt-1"
  }, "(Subtotal: ", subtotal.toFixed(2), " - Descuentos:", " ", totalDiscount.toFixed(2), ")")), taxes.map(taxItem => /*#__PURE__*/React.createElement("div", {
    key: taxItem.id,
    className: "tax-row mb-3 p-3 border rounded"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-5"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Impuesto"), /*#__PURE__*/React.createElement(Dropdown, {
    value: taxItem.tax,
    options: taxOptions // Usa las opciones que vienen del padre
    ,
    optionLabel: "name",
    placeholder: "Seleccione impuesto",
    className: "w-100",
    onChange: e => handleTaxChange(taxItem.id, "tax", e.value),
    appendTo: "self"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Porcentaje %"), /*#__PURE__*/React.createElement(InputNumber, {
    value: taxItem.percentage,
    mode: "decimal",
    min: 0,
    max: 100,
    suffix: "%",
    locale: "es-DO",
    className: "w-100",
    onValueChange: e => handleTaxChange(taxItem.id, "percentage", e.value),
    readOnly: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Valor"), /*#__PURE__*/React.createElement(InputNumber, {
    value: taxItem.value,
    mode: "currency",
    currency: "DOP",
    locale: "es-DO",
    className: "w-100",
    readOnly: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-1 d-flex align-items-end"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "button",
    className: "p-button-danger",
    onClick: () => handleRemoveTax(taxItem.id),
    tooltip: "Eliminar impuesto"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-trash"
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "tax-total mt-3 p-3 bg-light rounded"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "mb-0"
  }, "Total impuestos adicionales:"), /*#__PURE__*/React.createElement(InputNumber, {
    value: taxes.reduce((sum, t) => sum + t.value, 0),
    mode: "currency",
    currency: "DOP",
    locale: "es-DO",
    className: "font-weight-bold",
    readOnly: true
  }))))));
};

// Helper function to generate unique IDs
function generateId() {
  return Math.random().toString(36).substr(2, 9);
}