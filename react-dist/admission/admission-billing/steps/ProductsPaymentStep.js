import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputNumber } from "primereact/inputnumber";
import { Tag } from "primereact/tag";
import { Divider } from "primereact/divider";
import { Dialog } from "primereact/dialog";
import { calculateTotal, calculatePaid, calculateChange, validateProductsStep, validatePaymentStep } from "../utils/helpers.js";
import { paymentMethodOptions } from "../utils/constants.js";
import { useAppointmentProcedures } from "../../../appointments/hooks/useAppointmentProcedures.js";
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
  const total = calculateTotal(formData.products);
  const paid = calculatePaid(formData.payments);
  const change = calculateChange(total, paid);
  const remaining = Math.max(0, total - paid);
  const {
    procedureOptions,
    loadProcedures
  } = useAppointmentProcedures();
  useEffect(() => {
    loadProcedures();
  }, []);
  const getPaymentMethodLabel = value => {
    return paymentMethodOptions.find(m => m.value === value)?.label || value;
  };
  const getPaymentMethodIcon = method => {
    const methodLabel = paymentMethodOptions.find(m => m.value === method)?.label || method;
    switch (methodLabel) {
      case 'Efectivo':
        return 'fa-money-bill-wave';
      case 'Tarjeta de Crédito':
        return 'fa-credit-card';
      case 'Transferencia Bancaria':
        return 'fa-bank';
      case 'Cheque':
        return 'fa-file-invoice-dollar';
      default:
        return 'fa-wallet';
    }
  };
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
    const newProduct = {
      uuid: `${Math.random().toString(36).slice(2, 8)}${Math.random().toString(36).slice(2, 8)}`,
      id: procedure.id,
      code: procedure.barcode || `PROC-${procedure.id}`,
      name: procedure.name || 'Procedimiento sin nombre',
      description: procedure.description || procedure.name || 'Procedimiento médico',
      price: procedure.sale_price || 0,
      quantity: 1,
      tax: procedure.tax_charge?.percentage || 0,
      discount: 0,
      total: (procedure.sale_price || 0) * (1 + (procedure.tax_charge?.percentage || 0) / 100)
    };
    formData.products.push(newProduct);
    setSelectedProcedure(null);
  };
  const handleRemoveProduct = uuid => {
    console.log('Eliminando producto con uuid:', uuid);
    console.log('Productos actuales:', formData.products);
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
    if (field === 'method') {
      setShowChangeField(value === 'CASH');
    }
  };
  const handleAddPayment = () => {
    const {
      method,
      amount
    } = formData.currentPayment;
    if (!method || !amount) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Método de pago y monto son requeridos",
        life: 3000
      });
      return;
    }
    const paymentAmount = amount;
    if (isNaN(paymentAmount)) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "El monto debe ser un número válido",
        life: 3000
      });
      return;
    }
    addPayment({
      method: method,
      amount: paymentAmount,
      authorizationNumber: formData.currentPayment.authorizationNumber,
      notes: formData.currentPayment.notes
    });
    updateFormData("currentPayment", {
      method: "",
      amount: 0,
      authorizationNumber: "",
      notes: ""
    });
    setShowChangeField(false);
  };
  const handleNext = () => {
    console.log('Productos actuales:', formData.products);
    const validProducts = formData.products.filter(product => product && product.description && product.price !== undefined && product.quantity !== undefined);
    if (validProducts.length === 0) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No hay productos válidos para facturar',
        life: 3000
      });
      return;
    }
    const total = calculateTotal(validProducts);
    if (validateProductsStep(validProducts, toast) && validatePaymentStep(formData.payments, total, toast)) {
      nextStep();
    }
  };
  const formatCurrency = value => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP',
      minimumFractionDigits: 2
    }).format(value);
  };
  const openPaymentModal = () => {
    setShowPaymentModal(true);
    setModalAmount(remaining);
    setModalChange(0);
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
    return formatCurrency(rowData.price);
  };
  const productTaxBodyTemplate = rowData => {
    return /*#__PURE__*/React.createElement(Tag, {
      value: `${rowData.tax}%`,
      severity: "info"
    });
  };
  const productTotalBodyTemplate = rowData => {
    const total = rowData.price * rowData.quantity * (1 + rowData.tax / 100);
    return /*#__PURE__*/React.createElement("strong", null, formatCurrency(total));
  };
  const paymentAmountBodyTemplate = rowData => {
    return /*#__PURE__*/React.createElement("span", {
      className: "font-bold"
    }, formatCurrency(rowData.amount));
  };
  const paymentMethodBodyTemplate = rowData => {
    const methodLabel = paymentMethodOptions.find(m => m.value === rowData.method)?.label || rowData.method;
    return /*#__PURE__*/React.createElement("div", {
      className: "flex align-items-center gap-2"
    }, /*#__PURE__*/React.createElement("i", {
      className: `fas ${getPaymentMethodIcon(rowData.method)} mr-2`
    }), /*#__PURE__*/React.createElement("span", null, methodLabel));
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
  const paymentModalFooter = /*#__PURE__*/React.createElement("div", {
    className: "d-flex pt-4 justify-content-between gap-3"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-times"
    }),
    onClick: () => setShowPaymentModal(false),
    className: "p-button-secondary"
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Aplicar Pago",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-check"
    }),
    onClick: applyModalPayment,
    disabled: modalAmount <= 0,
    className: "p-button-primary me-2"
  }));
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
        quantity: 1,
        tax: product.tax_charge?.percentage || 0,
        discount: 0,
        total: (product.sale_price || 0) * (1 + (product.tax_charge?.percentage || 0) / 100)
      }));
      updateFormData("products", initialProducts);
    }
  }, [productsToInvoice]);
  return /*#__PURE__*/React.createElement("div", {
    className: "grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-8"
  }, /*#__PURE__*/React.createElement(Card, {
    title: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-shopping-cart mr-2"
    }), " Lista de Productos"),
    className: "mb-4 shadow-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex pt-4 justify-content-end mb-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "me-2 h-full w-full"
  }, /*#__PURE__*/React.createElement(Dropdown, {
    placeholder: "Seleccione un procedimiento",
    options: procedureOptions,
    value: selectedProcedure,
    onChange: e => setSelectedProcedure(e.value),
    optionLabel: "label",
    filter: true,
    showClear: true,
    className: "w-full h-full",
    panelClassName: "shadow-3",
    emptyMessage: "No se encontraron procedimientos"
  })), /*#__PURE__*/React.createElement(Button, {
    label: "Agregar Producto",
    className: "p-button-primary",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-plus-square"
    }),
    onClick: handleAddProduct,
    disabled: !selectedProcedure,
    tooltip: "Agregar procedimiento seleccionado"
  })), /*#__PURE__*/React.createElement("div", {
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
      width: '100px'
    },
    bodyStyle: {
      textAlign: 'center'
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
      width: '80px'
    }
  }))), /*#__PURE__*/React.createElement(Dialog, {
    header: /*#__PURE__*/React.createElement("div", {
      className: "flex align-items-center gap-2"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-calculator"
    }), /*#__PURE__*/React.createElement("span", null, "Calcular Pago en Efectivo")),
    visible: showPaymentModal,
    style: {
      width: '450px'
    },
    footer: paymentModalFooter,
    onHide: () => setShowPaymentModal(false),
    breakpoints: {
      '960px': '75vw',
      '640px': '90vw'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field"
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
    inputClassName: "font-bold"
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
    className: `w-full ${modalChange > 0 ? 'bg-green-100 font-bold' : ''}`,
    inputClassName: modalChange > 0 ? 'text-green-700' : ''
  })))), /*#__PURE__*/React.createElement("div", {
    className: "surface-card p-4 border-round-lg border-1 surface-border shadow-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end align-items-center mb-4 gap-3"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "m-0 text-700 text-right"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-credit-card mr-3 text-xl text-primary"
  }), "Agregar Nuevo Pago"), /*#__PURE__*/React.createElement(Button, {
    label: "Calcular Efectivo",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-calculator"
    }),
    className: "p-button-primary",
    onClick: openPaymentModal
  })), /*#__PURE__*/React.createElement(Card, {
    className: "border-round-lg shadow-1 mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column align-items-end gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-100 text-right"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "paymentMethod",
    className: "block font-medium mb-2 text-700 d-flex justify-content-end align-items-center"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-money-check-alt mr-2"
  }), "M\xE9todo de pago ", /*#__PURE__*/React.createElement("span", {
    className: "text-red-500 ml-1"
  }, "*")), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end"
  }, /*#__PURE__*/React.createElement(Dropdown, {
    inputId: "paymentMethod",
    options: paymentMethodOptions,
    value: formData.currentPayment.method,
    onChange: e => handlePaymentChange("method", e.value),
    placeholder: "Seleccione m\xE9todo...",
    className: "w-100",
    optionLabel: "label",
    panelClassName: "shadow-3",
    showClear: true,
    filter: true,
    filterPlaceholder: "Buscar m\xE9todo...",
    emptyFilterMessage: "No se encontraron m\xE9todos",
    style: {
      maxWidth: '400px'
    }
  })), !formData.currentPayment.method && /*#__PURE__*/React.createElement("small", {
    className: "p-error block mt-1 text-right d-flex justify-content-end"
  }, "Seleccione un m\xE9todo de pago")), /*#__PURE__*/React.createElement("div", {
    className: "w-100 text-right"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "paymentAmount",
    className: "block font-medium mb-2 text-700 d-flex justify-content-end align-items-center"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-dollar-sign mr-2"
  }), "Monto ", /*#__PURE__*/React.createElement("span", {
    className: "text-red-500 ml-1"
  }, "*")), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end"
  }, /*#__PURE__*/React.createElement(InputNumber, {
    inputId: "paymentAmount",
    value: formData.currentPayment.amount,
    onValueChange: e => handlePaymentChange("amount", e.value),
    className: "w-100",
    mode: "currency",
    currency: "DOP",
    locale: "es-DO",
    min: 0,
    maxFractionDigits: 2,
    showButtons: true,
    buttonLayout: "horizontal",
    incrementButtonIcon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-plus-square"
    }),
    decrementButtonIcon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-window-close"
    }),
    style: {
      maxWidth: '400px'
    }
  })), (!formData.currentPayment.amount || formData.currentPayment.amount <= 0) && /*#__PURE__*/React.createElement("small", {
    className: "p-error block mt-1 text-right d-flex justify-content-end"
  }, "Ingrese un monto v\xE1lido")), showChangeField && formData.currentPayment.amount > 0 && /*#__PURE__*/React.createElement("div", {
    className: "w-100 text-right"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-3 bg-green-100 border-round mb-3 border-1 border-green-200",
    style: {
      maxWidth: '400px',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center gap-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-money-bill-wave text-green-600"
  }), /*#__PURE__*/React.createElement("span", {
    className: "font-medium"
  }, "Cambio a devolver:")), /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-green-700"
  }, formatCurrency(calculateChange(total, formData.currentPayment.amount))))))))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end mt-4"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Agregar Pago",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-cash-register"
    }),
    className: "p-button-primary",
    onClick: handleAddPayment,
    disabled: !formData.currentPayment.method || !formData.currentPayment.amount,
    tooltip: "Agregar este pago al registro",
    tooltipOptions: {
      position: "left"
    }
  }))))), /*#__PURE__*/React.createElement("div", {
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
    disabled: formData.payments.length === 0 || formData.products.length === 0
  }))));
};
export default ProductsPaymentStep;