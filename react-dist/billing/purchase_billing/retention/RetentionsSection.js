import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { retentionsService } from "../../../../services/api/index.js";
export const RetentionsSection = ({
  subtotal,
  totalDiscount,
  retentions,
  onRetentionsChange,
  productsArray
}) => {
  const [retentionOptions, setRetentionOptions] = useState([]);
  useEffect(() => {
    loadRetentions();
  }, []);
  async function loadRetentions() {
    try {
      const response = await retentionsService.getRetentions();
      setRetentionOptions(response.data); // Assuming the API returns the array directly
    } catch (error) {
      console.error("Error loading retentions:", error);
    }
  }
  const calculateBaseAmount = () => {
    return (subtotal || 0) - (totalDiscount || 0);
  };
  const calculateRetentionValue = retention => {
    const base = calculateBaseAmount();
    let productsFiltered = productsArray?.filter(item => item?.tax?.id == retention?.percentage?.tax?.id) || [];
    if (productsFiltered.length && retention?.percentage?.tax_id !== null) {
      productsFiltered = productsFiltered.reduce((total, product) => {
        const actualQuantity = ["medications", "vaccines"].includes(product.typeProduct) && product?.lotInfo ? (product.lotInfo || []).reduce((sum, lot) => sum + (lot.quantity || 0), 0) : Number(product.quantity) || 0;
        const subtotal = actualQuantity * (Number(product?.price) || 0);
        let discount = 0;
        if (product?.discountType === "percentage") {
          discount = subtotal * ((Number(product?.discount) || 0) / 100);
        } else {
          discount = Number(product?.discount) || 0;
        }
        const subtotalAfterDiscount = subtotal - discount;
        const taxValue = subtotalAfterDiscount * ((Number(product?.tax?.percentage) || Number(product?.iva) || 0) / 100);
        return total + taxValue;
      }, 0);
      return productsFiltered * (Number(retention?.percentage?.percentage) || 0) / 100;
    } else {
      return base * (Number(retention?.percentage?.percentage) || 0) / 100;
    }
  };
  const handleAddRetention = () => {
    const newRetention = {
      id: generateId(),
      percentage: 0,
      value: 0
    };
    onRetentionsChange([...retentions, newRetention]);
  };
  const handleRemoveRetention = id => {
    onRetentionsChange(retentions.filter(r => r.id !== id));
  };
  const handleRetentionChange = (id, field, value) => {
    const updatedRetentions = retentions.map(retention => {
      if (retention.id === id) {
        const updatedRetention = {
          ...retention,
          [field]: value
        };
        if (field === "percentage") {
          updatedRetention.value = calculateRetentionValue({
            percentage: value
          });
        }
        return updatedRetention;
      }
      return retention;
    });
    onRetentionsChange(updatedRetentions);
  };
  useEffect(() => {
    const updatedRetentions = retentions.map(retention => ({
      ...retention,
      value: calculateRetentionValue(retention)
    }));
    onRetentionsChange(updatedRetentions);
  }, [subtotal, totalDiscount, productsArray]);
  return /*#__PURE__*/React.createElement("div", {
    className: "card mb-4 shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-header bg-light d-flex justify-content-between align-items-center"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "h5 mb-0"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-percentage me-2 text-primary"
  }), "Retenciones (DOP)"), /*#__PURE__*/React.createElement(Button, {
    type: "button",
    label: "Agregar retenci\xF3n",
    className: "p-button-primary",
    onClick: handleAddRetention
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-hand-holding-usd me-2",
    style: {
      marginLeft: "10px"
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "retentions-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("strong", null, "Base para retenciones:"), " ", /*#__PURE__*/React.createElement(InputNumber, {
    value: calculateBaseAmount(),
    mode: "currency",
    currency: "DOP",
    locale: "es-DO",
    readOnly: true,
    className: "ml-2"
  }), /*#__PURE__*/React.createElement("small", {
    className: "d-block text-muted mt-1"
  }, "(Subtotal: ", (subtotal || 0).toFixed(2), " - Descuentos:", " ", (totalDiscount || 0).toFixed(2), ")")), retentions.map(retention => /*#__PURE__*/React.createElement("div", {
    key: retention.id,
    className: "retention-row mb-3 p-3 border rounded"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-5"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Porcentaje retenci\xF3n"), /*#__PURE__*/React.createElement(Dropdown, {
    value: retention.percentage,
    options: retentionOptions,
    optionLabel: "name",
    placeholder: "Seleccione porcentaje",
    className: "w-100 dropdown-billing-retention",
    onChange: e => handleRetentionChange(retention.id, "percentage", e.value),
    appendTo: "self",
    filter: true,
    showClear: true,
    filterBy: "name"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-5"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Valor"), /*#__PURE__*/React.createElement(InputNumber, {
    value: retention.value || 0,
    mode: "currency",
    currency: "DOP",
    locale: "es-DO",
    className: "w-100",
    readOnly: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-2 d-flex align-items-end"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "button",
    className: "p-button-danger",
    onClick: () => handleRemoveRetention(retention.id),
    tooltip: "Eliminar retenci\xF3n"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-trash"
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "retention-total mt-3 p-3 bg-light rounded"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "mb-0"
  }, "Total retenciones:"), /*#__PURE__*/React.createElement(InputNumber, {
    value: retentions.reduce((sum, r) => sum + (r.value || 0), 0),
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