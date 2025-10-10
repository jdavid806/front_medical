import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputNumber } from "primereact/inputnumber";
import { Tag } from "primereact/tag";
import { Divider } from "primereact/divider";
import { calculateTotal, calculatePaid, calculateChange, validateProductsStep, validatePaymentStep } from "../utils/helpers.js";
import { useAppointmentProcedures } from "../../../appointments/hooks/useAppointmentProcedures.js";
import { usePaymentMethods } from "../../../payment-methods/hooks/usePaymentMethods.js";
const ProductsPaymentStep = ({
  updateFormData,
  addPayment,
  removePayment,
  nextStep,
  prevStep,
  toast,
  productsToInvoice = [],
  productsLoading = false,
  formData
}) => {
  const [showChangeField, setShowChangeField] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [modalAmount, setModalAmount] = useState(0);
  const [modalChange, setModalChange] = useState(0);
  const [selectedProcedure, setSelectedProcedure] = useState(null);
  const [filteredPaymentMethods, setFilteredPaymentMethods] = useState([]);
  const total = calculateTotal(formData.products, formData.billing.facturacionEntidad);
  const paid = calculatePaid(formData.payments);
  const change = calculateChange(total, paid);
  const remaining = Math.max(0, total - paid);
  const {
    procedureOptions,
    loadProcedures
  } = useAppointmentProcedures();
  const {
    paymentMethods,
    fetchPaymentMethods
  } = usePaymentMethods();
  useEffect(() => {
    loadProcedures();
    fetchPaymentMethods();
  }, []);
  useEffect(() => {
    if (paymentMethods) {
      const filtered = paymentMethods.filter(method => method.category === "transactional" && method.payment_type === "sale");
      setFilteredPaymentMethods(filtered);
    }
  }, [paymentMethods]);
  const handleAddProduct = () => {
    if (!selectedProcedure) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Debe seleccionar un procedimiento primero",
        life: 3000
      });
      return;
    }
    const procedure = selectedProcedure.item || selectedProcedure.value || selectedProcedure;
    if (!procedure || !procedure.id) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "El procedimiento seleccionado no es válido",
        life: 3000
      });
      return;
    }
    const price = formData.billing.facturacionEntidad ? procedure.copayment : procedure.sale_price;
    const newProduct = {
      uuid: `${Math.random().toString(36).slice(2, 8)}${Math.random().toString(36).slice(2, 8)}`,
      id: procedure.id,
      code: procedure.barcode || `PROC-${procedure.id}`,
      name: procedure.name || "Procedimiento sin nombre",
      description: procedure.description || procedure.name || "Procedimiento médico",
      price: procedure.sale_price,
      copayment: procedure.copayment,
      currentPrice: price,
      quantity: 1,
      tax: procedure.tax_charge?.percentage || 0,
      discount: 0,
      total: (price || 0) * (1 + (procedure.tax_charge?.percentage || 0) / 100)
    };
    formData.products = [...formData.products, newProduct];
    setSelectedProcedure(null);
  };
  useEffect(() => {
    setModalAmount(remaining);
    setModalChange(0);
  }, [formData.products, formData.billing.facturacionEntidad]);
  const handleRemoveProduct = uuid => {
    const updatedProducts = formData.products.filter(product => product.uuid !== uuid);
    updateFormData("products", updatedProducts);
    toast.current?.show({
      severity: "success",
      summary: "Producto eliminado",
      detail: "El producto ha sido removido correctamente",
      life: 3000
    });
  };
  const handleRemovePayment = id => {
    removePayment(id);
    toast.current?.show({
      severity: "success",
      summary: "Pago eliminado",
      detail: "El pago ha sido removido correctamente",
      life: 3000
    });
  };
  const handlePaymentChange = (field, value) => {
    updateFormData("currentPayment", {
      [field]: value
    });
    if (field === "method") {
      setShowChangeField(value === "CASH");
    }
  };
  const handleAddPayment = () => {
    const {
      method
    } = formData.currentPayment;
    if (remaining <= 0) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "El pago ya ha sido completado",
        life: 3000
      });
      return;
    }
    if (!method || !modalAmount) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Método de pago y monto son requeridos",
        life: 3000
      });
      return;
    }
    const paymentAmount = modalAmount;
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "El monto debe ser un número válido mayor a 0",
        life: 3000
      });
      return;
    }

    // if (paymentAmount > remaining) {
    //   toast.current?.show({
    //     severity: "error",
    //     summary: "Error",
    //     detail: `El monto no puede exceder el saldo pendiente: ${formatCurrency(
    //       remaining
    //     )}`,
    //     life: 3000,
    //   });
    //   return;
    // }

    addPayment({
      method: method.method,
      amount: paymentAmount,
      total: paymentAmount - modalChange,
      change: modalChange,
      authorizationNumber: formData.currentPayment.authorizationNumber,
      notes: formData.currentPayment.notes
    });
    setModalAmount(0);
    setModalChange(0);
    updateFormData("currentPayment", {
      method: "",
      amount: 0,
      authorizationNumber: "",
      notes: ""
    });
    setShowChangeField(false);
  };
  const handleNext = () => {
    const validProducts = formData.products.filter(product => product && product.description && product.price !== undefined && product.quantity !== undefined);
    if (validProducts.length === 0) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No hay productos válidos para facturar",
        life: 3000
      });
      return;
    }
    const total = calculateTotal(validProducts, formData.billing.facturacionEntidad);
    if (validateProductsStep(validProducts, toast) && validatePaymentStep(formData.payments, total, toast)) {
      nextStep();
    }
  };
  const formatCurrency = value => {
    return new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 2
    }).format(value);
  };
  const calculateModalChange = amount => {
    setModalAmount(amount);
    setModalChange(Math.max(0, amount - remaining));
  };
  const applyModalPayment = () => {
    updateFormData("currentPayment", {
      ...formData.currentPayment,
      method: "CASH",
      amount: modalAmount
    });
    setShowPaymentModal(false);
    setShowChangeField(true);
  };
  const productPriceBodyTemplate = rowData => {
    return formatCurrency(rowData.currentPrice);
  };
  const productTaxBodyTemplate = rowData => {
    return /*#__PURE__*/React.createElement(Tag, {
      value: `${rowData.tax}%`,
      severity: "info"
    });
  };
  const productTotalBodyTemplate = rowData => {
    const total = rowData.currentPrice * rowData.quantity * (1 + rowData.tax / 100);
    return /*#__PURE__*/React.createElement("strong", null, formatCurrency(total));
  };
  const paymentAmountBodyTemplate = rowData => {
    return /*#__PURE__*/React.createElement("span", {
      className: "font-bold"
    }, formatCurrency(rowData.total));
  };
  const paymentChangeBodyTemplate = rowData => {
    return /*#__PURE__*/React.createElement("span", {
      className: "font-bold"
    }, formatCurrency(rowData.change));
  };
  const paymentMethodBodyTemplate = rowData => {
    return /*#__PURE__*/React.createElement("div", {
      className: "flex align-items-center gap-2"
    }, /*#__PURE__*/React.createElement("i", {
      className: `mr-2`
    }), /*#__PURE__*/React.createElement("span", null, rowData.method));
  };
  const actionBodyTemplate = rowData => {
    return /*#__PURE__*/React.createElement(Button, {
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fas fa-trash"
      }),
      className: "p-button-danger p-button-rounded p-button-outlined p-button-sm",
      onClick: () => handleRemoveProduct(rowData.uuid),
      tooltip: "Eliminar",
      tooltipOptions: {
        position: "top"
      }
    });
  };
  useEffect(() => {
    if (productsToInvoice.length > 0 && formData.products.length === 0) {
      const initialProducts = productsToInvoice.map(product => ({
        uuid: product.uuid,
        id: product.id,
        productId: product.id,
        code: product.barcode || `PROD-${product.id}`,
        name: product.name || product.description || `Producto ${product.id}`,
        description: product.description || product.name || `Producto ${product.id}`,
        price: product.sale_price || 0,
        copayment: product.copayment || 0,
        currentPrice: (formData.billing.facturacionEntidad ? product.copayment : product.sale_price) || 0,
        quantity: 1,
        tax: product.tax_charge?.percentage || 0,
        discount: 0,
        total: (product.sale_price || 0) * (1 + (product.tax_charge?.percentage || 0) / 100)
      }));
      updateFormData("products", initialProducts);
      setModalAmount(remaining);
    }
  }, [productsToInvoice, formData.billing.facturacionEntidad]);
  return /*#__PURE__*/React.createElement("div", {
    className: "grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-8"
  }, /*#__PURE__*/React.createElement(Card, {
    title: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-shopping-cart mr-2"
    }), " Lista de Productos"),
    className: "mb-4 shadow-3"
  }, productsToInvoice.length == 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "d-flex pt-4 mb-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-grow-1 me-2"
  }, /*#__PURE__*/React.createElement(Dropdown, {
    placeholder: "Seleccione un procedimiento",
    options: procedureOptions,
    value: selectedProcedure,
    onChange: e => setSelectedProcedure(e.value),
    optionLabel: "label",
    filter: true,
    showClear: true,
    className: "w-100",
    panelClassName: "shadow-3 w-100",
    emptyMessage: "No se encontraron procedimientos"
  })), /*#__PURE__*/React.createElement(Button, {
    label: "Agregar Producto",
    className: "p-button-primary d-flex",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-plus-square"
    }),
    onClick: handleAddProduct,
    disabled: !selectedProcedure,
    tooltip: "Agregar procedimiento seleccionado"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "border-round border-1 surface-border"
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: formData.products,
    className: "p-datatable-sm p-datatable-gridlines",
    scrollable: true,
    scrollHeight: "flex",
    emptyMessage: "No se han agregado productos",
    stripedRows: true
  }, /*#__PURE__*/React.createElement(Column, {
    field: "code",
    header: "C\xF3digo"
  }), /*#__PURE__*/React.createElement(Column, {
    field: "description",
    header: "Descripci\xF3n"
  }), /*#__PURE__*/React.createElement(Column, {
    field: "price",
    header: "Precio Unitario",
    body: productPriceBodyTemplate
  }), /*#__PURE__*/React.createElement(Column, {
    field: "quantity",
    header: "Cantidad"
  }), /*#__PURE__*/React.createElement(Column, {
    field: "tax",
    header: "Impuesto",
    body: productTaxBodyTemplate
  }), /*#__PURE__*/React.createElement(Column, {
    field: "total",
    header: "Total",
    body: productTotalBodyTemplate
  }), /*#__PURE__*/React.createElement(Column, {
    header: "Acciones",
    body: rowData => /*#__PURE__*/React.createElement(Button, {
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fas fa-trash"
      }),
      className: "p-button-danger p-button-rounded p-button-outlined p-button-sm",
      onClick: () => handleRemoveProduct(rowData.uuid),
      tooltip: "Eliminar",
      tooltipOptions: {
        position: "top"
      }
    }),
    headerStyle: {
      width: "100px"
    },
    bodyStyle: {
      textAlign: "center"
    }
  }))), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-content-end align-items-center gap-3 mt-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-lg"
  }, "Total General:"), /*#__PURE__*/React.createElement("span", {
    className: "text-xl font-bold text-primary"
  }, formatCurrency(total))))), /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-4"
  }, /*#__PURE__*/React.createElement(Card, {
    title: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-credit-card mr-2"
    }), " M\xE9todos de Pago"),
    className: "mb-4 shadow-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-6 pb-4"
  }, change > 0 && /*#__PURE__*/React.createElement(Card, {
    className: "mb-4 border-left-3 border-teal-500 bg-teal-50"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-content-between align-items-center p-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex align-items-center gap-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-money-bill-wave text-teal-500"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-lg font-medium"
  }, "Cambio a devolver")), /*#__PURE__*/React.createElement("span", {
    className: "text-xl font-bold text-teal-700"
  }, formatCurrency(change)))), /*#__PURE__*/React.createElement("div", {
    className: "border-round border-1 surface-border mb-4"
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: formData.payments,
    className: "p-datatable-sm p-datatable-gridlines",
    emptyMessage: /*#__PURE__*/React.createElement("div", {
      className: "text-center p-4"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-info-circle mr-2"
    }), "No se han agregado m\xE9todos de pago"),
    stripedRows: true
  }, /*#__PURE__*/React.createElement(Column, {
    field: "id",
    header: "#",
    headerStyle: {
      width: "50px"
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "method",
    header: "M\xE9todo",
    body: paymentMethodBodyTemplate
  }), /*#__PURE__*/React.createElement(Column, {
    field: "amount",
    header: "Monto",
    body: paymentAmountBodyTemplate
  }), /*#__PURE__*/React.createElement(Column, {
    field: "change",
    header: "Cambio",
    body: paymentChangeBodyTemplate
  }), /*#__PURE__*/React.createElement(Column, {
    header: "Acciones",
    body: rowData => /*#__PURE__*/React.createElement(Button, {
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fas fa-trash"
      }),
      className: "p-button-danger p-button-rounded p-button-outlined p-button-sm",
      onClick: () => handleRemovePayment(rowData.id),
      tooltip: "Eliminar",
      tooltipOptions: {
        position: "top"
      }
    }),
    headerStyle: {
      width: "80px"
    }
  })))), /*#__PURE__*/React.createElement("div", {
    className: "surface-card px-4 pb-4 border-round-lg border-1 surface-border shadow-2 col-12 col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center mb-4 gap-3"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "m-0 text-700 text-right"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-credit-card mr-3 text-xl text-primary"
  }), "Agregar Nuevo Pago")), /*#__PURE__*/React.createElement(Card, {
    className: "border-round-lg shadow-1 mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "paymentMethod",
    className: "block font-medium mb-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-money-check-alt mr-2"
  }), "M\xE9todo de pago"), /*#__PURE__*/React.createElement(Dropdown, {
    inputId: "paymentMethod",
    options: filteredPaymentMethods,
    value: formData.currentPayment.method,
    onChange: e => handlePaymentChange("method", e.value),
    placeholder: "Seleccione m\xE9todo...",
    className: "w-100",
    optionLabel: "method",
    panelClassName: "shadow-3",
    showClear: true,
    filter: true,
    filterPlaceholder: "Buscar m\xE9todo...",
    emptyFilterMessage: "No se encontraron m\xE9todos",
    disabled: remaining <= 0
  }), remaining <= 0 && /*#__PURE__*/React.createElement("div", {
    className: "mt-2 p-3 border-round-lg bg-green-100 text-green-800"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-check-circle mr-2"
  }), "El pago ha sido completado en su totalidad")), formData.currentPayment.method.is_cash && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "field mt-4"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "remainingAmount",
    className: "block font-medium mb-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-receipt mr-2"
  }), "Total Pendiente"), /*#__PURE__*/React.createElement(InputNumber, {
    id: "remainingAmount",
    value: remaining,
    mode: "currency",
    currency: "DOP",
    locale: "es-DO",
    readOnly: true,
    className: "w-full",
    inputClassName: "font-bold"
  })), /*#__PURE__*/React.createElement("div", {
    className: "field mt-4"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "cashAmount",
    className: "block font-medium mb-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-hand-holding-usd mr-2"
  }), "Monto Recibido"), /*#__PURE__*/React.createElement(InputNumber, {
    id: "cashAmount",
    value: modalAmount,
    onValueChange: e => calculateModalChange(e.value || 0),
    mode: "currency",
    currency: "DOP",
    locale: "es-DO",
    className: "w-full",
    inputClassName: "font-bold",
    min: 0
  })), /*#__PURE__*/React.createElement("div", {
    className: "field mt-4"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "changeAmount",
    className: "block font-medium mb-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-exchange-alt mr-2"
  }), "Cambio a Devolver"), /*#__PURE__*/React.createElement(InputNumber, {
    id: "changeAmount",
    value: modalChange,
    mode: "currency",
    currency: "DOP",
    locale: "es-DO",
    readOnly: true,
    className: `w-full ${modalChange > 0 ? "bg-green-100 font-bold" : ""}`,
    inputClassName: modalChange > 0 ? "text-green-700" : ""
  }))), formData.currentPayment.method.method != "Efectivo" && remaining > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "field mt-4"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "cashAmount",
    className: "block font-medium mb-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-hand-holding-usd mr-2"
  }), "Monto Recibido"), /*#__PURE__*/React.createElement(InputNumber, {
    id: "cashAmount",
    value: modalAmount,
    onValueChange: e => calculateModalChange(e.value || 0),
    mode: "currency",
    currency: "DOP",
    locale: "es-DO",
    className: "w-full",
    inputClassName: "font-bold"
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex mt-4"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Agregar Pago",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-cash-register"
    }),
    className: "p-button-primary",
    onClick: handleAddPayment,
    tooltip: "Agregar este pago al registro",
    tooltipOptions: {
      position: "left"
    }
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between pt-4"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Atr\xE1s",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-arrow-left me-1"
    }),
    onClick: prevStep,
    className: "p-button-secondary"
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Continuar",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-save me-1"
    }),
    className: "p-button-primary",
    onClick: handleNext,
    disabled: formData.payments.length === 0 && total > 0 || formData.products.length === 0
  }))));
};
export default ProductsPaymentStep;