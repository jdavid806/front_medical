function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, InputText, Dropdown, Calendar, DataTable, Column, Toast, InputNumber, Checkbox } from "primereact";

// Definición de tipos

export const FormDocumentSupport = () => {
  const {
    control,
    handleSubmit,
    watch
  } = useForm({
    defaultValues: {
      noteType: null,
      elaborationDate: null,
      supplier: null,
      supplierInvoiceNumber: '',
      costCenter: null,
      consecutiveCode: 'SP-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
      applyDiscount: false
    }
  });
  const [visibleModal, setVisibleModal] = useState(false);
  const [billingItems, setBillingItems] = useState([{
    id: generateId(),
    type: null,
    product: "",
    description: "",
    quantity: 0,
    unitPrice: 0,
    discount: 0,
    tax: 0,
    retention: 0,
    totalValue: 0
  }]);
  const [paymentMethods, setPaymentMethods] = useState([{
    id: generateId(),
    method: "",
    authorizationNumber: "",
    value: 0
  }]);

  // Helper function to generate unique IDs
  function generateId() {
    return Math.random().toString(36).substr(2, 9);
  }

  // Opciones del formulario
  const noteTypeOptions = [{
    id: 1,
    name: "Débito"
  }, {
    id: 2,
    name: "Crédito"
  }];
  const itemTypeOptions = [{
    id: 1,
    name: "Producto"
  }, {
    id: 2,
    name: "Servicio"
  }];
  const costCenterOptions = [{
    id: 1,
    name: "SOPORTE_TECNICO"
  }, {
    id: 2,
    name: "MANTENIMIENTO"
  }, {
    id: 3,
    name: "INFRAESTRUCTURA"
  }, {
    id: 4,
    name: "DESARROLLO"
  }];
  const productOptions = [{
    id: "S001",
    name: "REPUESTO 1"
  }, {
    id: "S002",
    name: "REPUESTO 2"
  }, {
    id: "S003",
    name: "REPUESTO 3"
  }, {
    id: "S004",
    name: "REPUESTO 4"
  }];
  const supplierOptions = [{
    id: 1,
    name: "PROVEEDOR 1"
  }, {
    id: 2,
    name: "PROVEEDOR 2"
  }, {
    id: 3,
    name: "PROVEEDOR 3"
  }];
  const taxOptions = [{
    id: 0,
    name: "0%",
    rate: 0
  }, {
    id: 12,
    name: "12%",
    rate: 12
  }, {
    id: 14,
    name: "14%",
    rate: 14
  }];
  const retentionOptions = [{
    id: 0,
    name: "No Aplica",
    rate: 0
  }, {
    id: 1,
    name: "1%",
    rate: 1
  }, {
    id: 2,
    name: "2%",
    rate: 2
  }, {
    id: 5,
    name: "5%",
    rate: 5
  }, {
    id: 10,
    name: "10%",
    rate: 10
  }];
  const paymentMethodOptions = [{
    id: 1,
    name: "EFECTIVO"
  }, {
    id: 2,
    name: "TARJETA_CREDITO"
  }, {
    id: 3,
    name: "TRANSFERENCIA"
  }, {
    id: 4,
    name: "CHEQUE"
  }];

  // Funciones de cálculo en DOP
  const calculateLineTotal = item => {
    const quantity = Number(item.quantity) || 0;
    const unitPrice = Number(item.unitPrice) || 0;
    const discount = Number(item.discount) || 0;
    const taxRate = typeof item.tax === 'object' ? item.tax.rate : Number(item.tax) || 0;
    const retentionRate = typeof item.retention === 'object' ? item.retention.rate : Number(item.retention) || 0;
    const subtotal = quantity * unitPrice;
    const discountAmount = subtotal * (discount / 100);
    const subtotalAfterDiscount = subtotal - discountAmount;
    const taxAmount = subtotalAfterDiscount * (taxRate / 100);
    const retentionAmount = subtotalAfterDiscount * (retentionRate / 100);
    const lineTotal = subtotalAfterDiscount + taxAmount - retentionAmount;
    return parseFloat(lineTotal.toFixed(2));
  };
  const calculateSubtotal = () => {
    return billingItems.reduce((total, item) => {
      const quantity = Number(item.quantity) || 0;
      const unitPrice = Number(item.unitPrice) || 0;
      return total + quantity * unitPrice;
    }, 0);
  };
  const calculateTotalDiscount = () => {
    return billingItems.reduce((total, item) => {
      const subtotal = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
      const discount = Number(item.discount) || 0;
      return total + subtotal * (discount / 100);
    }, 0);
  };
  const calculateTotalTax = () => {
    return billingItems.reduce((total, item) => {
      const subtotal = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
      const discountAmount = subtotal * ((Number(item.discount) || 0) / 100);
      const subtotalAfterDiscount = subtotal - discountAmount;
      const taxRate = typeof item.tax === 'object' ? item.tax.rate : Number(item.tax) || 0;
      return total + subtotalAfterDiscount * (taxRate / 100);
    }, 0);
  };
  const calculateSubtotalAfterDiscount = () => {
    return calculateSubtotal() - calculateTotalDiscount();
  };
  const calculateTotalWithholdingTax = () => {
    return billingItems.reduce((total, item) => {
      const subtotal = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
      const discountAmount = subtotal * ((Number(item.discount) || 0) / 100);
      const subtotalAfterDiscount = subtotal - discountAmount;
      const retentionRate = typeof item.retention === 'object' ? item.retention.rate : Number(item.retention) || 0;
      return total + subtotalAfterDiscount * (retentionRate / 100);
    }, 0);
  };
  const calculateTotal = () => {
    return billingItems.reduce((total, item) => {
      return total + calculateLineTotal(item);
    }, 0);
  };
  const calculateTotalPayments = () => {
    return paymentMethods.reduce((total, payment) => {
      return total + (Number(payment.value) || 0);
    }, 0);
  };
  const paymentCoverage = () => {
    const total = calculateTotal();
    const payments = calculateTotalPayments();
    return Math.abs(payments - total) < 0.01;
  };

  // Funciones para manejar items de facturación
  const addBillingItem = () => {
    setBillingItems([...billingItems, {
      id: generateId(),
      type: null,
      product: "",
      description: "",
      quantity: 0,
      unitPrice: 0,
      discount: 0,
      tax: 0,
      retention: 0,
      totalValue: 0
    }]);
  };
  const removeBillingItem = id => {
    if (billingItems.length > 1) {
      setBillingItems(prevItems => prevItems.filter(item => item.id !== id));
    }
  };
  const handleBillingItemChange = (id, field, value) => {
    setBillingItems(prevItems => prevItems.map(item => item.id === id ? {
      ...item,
      [field]: value
    } : item));
  };

  // Funciones para manejar métodos de pago
  const addPaymentMethod = () => {
    setPaymentMethods([...paymentMethods, {
      id: generateId(),
      method: "",
      authorizationNumber: "",
      value: 0
    }]);
  };
  const removePaymentMethod = id => {
    if (paymentMethods.length > 1) {
      setPaymentMethods(prevPayments => prevPayments.filter(payment => payment.id !== id));
    }
  };
  const handlePaymentMethodChange = (id, field, value) => {
    setPaymentMethods(prevPayments => prevPayments.map(payment => payment.id === id ? {
      ...payment,
      [field]: value
    } : payment));
  };

  // Funciones para guardar
  const save = formData => {
    if (billingItems.length === 0) {
      window['toast'].show({
        severity: 'error',
        summary: 'Error',
        detail: 'Debe agregar al menos un item de facturación',
        life: 5000
      });
      return;
    }
    if (paymentMethods.length === 0) {
      window['toast'].show({
        severity: 'error',
        summary: 'Error',
        detail: 'Debe agregar al menos un método de pago',
        life: 5000
      });
      return;
    }
    if (!paymentCoverage()) {
      window['toast'].show({
        severity: 'error',
        summary: 'Error',
        detail: `Los métodos de pago (${calculateTotalPayments().toFixed(2)} DOP) no cubren el total (${calculateTotal().toFixed(2)} DOP)`,
        life: 5000
      });
      return;
    }
    const formatDate = date => {
      if (!date) return '';
      return date.toISOString();
    };
    const noteData = {
      noteType: formData.noteType ? formData.noteType.name : "",
      elaborationDate: formatDate(formData.elaborationDate),
      supplier: formData.supplier ? formData.supplier.name : "",
      supplierInvoiceNumber: formData.supplierInvoiceNumber || "",
      costCenter: formData.costCenter ? formData.costCenter.name : "",
      consecutiveCode: formData.consecutiveCode || "",
      applyDiscount: formData.applyDiscount || false,
      billingItems: billingItems.map(item => ({
        type: item.type ? item.type.name : "",
        product: typeof item.product === 'object' ? item.product.name : item.product,
        description: item.description || "",
        quantity: item.quantity || 0,
        unitPrice: item.unitPrice || 0,
        discount: item.discount || 0,
        tax: typeof item.tax === 'object' ? item.tax.rate : item.tax || 0,
        retention: typeof item.retention === 'object' ? item.retention.rate : item.retention || 0,
        lineTotal: calculateLineTotal(item)
      })),
      paymentMethods: paymentMethods.map(payment => ({
        method: typeof payment.method === 'object' ? payment.method.name : payment.method,
        authorizationNumber: payment.authorizationNumber || "",
        amount: payment.value || 0
      })),
      subtotal: calculateSubtotal(),
      totalDiscount: calculateTotalDiscount(),
      subtotalAfterDiscount: calculateSubtotalAfterDiscount(),
      totalTax: calculateTotalTax(),
      totalWithholdingTax: calculateTotalWithholdingTax(),
      grandTotal: calculateTotal(),
      currency: "DOP"
    };
    console.log("📄 Datos completos de la nota de soporte:", noteData);
  };
  const saveAndSend = formData => {
    save(formData);
    console.log("Enviando nota de soporte...");
  };

  // Columnas para la tabla de items de facturación
  const billingItemColumns = [{
    field: "type",
    header: "Tipo",
    body: rowData => /*#__PURE__*/React.createElement(Dropdown, {
      value: rowData.type,
      options: itemTypeOptions,
      optionLabel: "name",
      placeholder: "Seleccione tipo",
      className: "w-100",
      onChange: e => handleBillingItemChange(rowData.id, 'type', e.value)
    })
  }, {
    field: "product",
    header: "Producto",
    body: rowData => /*#__PURE__*/React.createElement(Dropdown, {
      value: rowData.product,
      options: productOptions,
      optionLabel: "name",
      placeholder: "Seleccione Producto",
      className: "w-100",
      onChange: e => handleBillingItemChange(rowData.id, 'product', e.value)
    })
  }, {
    field: "description",
    header: "Descripción",
    body: rowData => /*#__PURE__*/React.createElement(InputText, {
      value: rowData.description,
      placeholder: "Ingresar Descripci\xF3n",
      onChange: e => handleBillingItemChange(rowData.id, 'description', e.target.value)
    })
  }, {
    field: "quantity",
    header: "Cantidad",
    body: rowData => /*#__PURE__*/React.createElement(InputNumber, {
      value: rowData.quantity,
      placeholder: "Cantidad",
      className: "w-100",
      min: 0,
      onValueChange: e => handleBillingItemChange(rowData.id, 'quantity', e.value || 0)
    })
  }, {
    field: "unitPrice",
    header: "Valor unitario",
    body: rowData => /*#__PURE__*/React.createElement(InputNumber, {
      value: rowData.unitPrice,
      placeholder: "Precio",
      className: "w-100",
      mode: "currency",
      currency: "DOP",
      locale: "es-DO",
      min: 0,
      onValueChange: e => handleBillingItemChange(rowData.id, 'unitPrice', e.value || 0)
    })
  }, {
    field: "discount",
    header: "% Dscto",
    body: rowData => /*#__PURE__*/React.createElement(InputNumber, {
      value: rowData.discount,
      placeholder: "Descuento",
      className: "w-100",
      suffix: "%",
      min: 0,
      max: 100,
      onValueChange: e => handleBillingItemChange(rowData.id, 'discount', e.value || 0)
    })
  }, {
    field: "tax",
    header: "Impuesto",
    body: rowData => /*#__PURE__*/React.createElement(Dropdown, {
      value: rowData.tax,
      options: taxOptions,
      optionLabel: "name",
      placeholder: "Seleccione Impuesto",
      className: "w-100",
      onChange: e => handleBillingItemChange(rowData.id, 'tax', e.value)
    })
  }, {
    field: "retention",
    header: "Retención",
    body: rowData => /*#__PURE__*/React.createElement(Dropdown, {
      value: rowData.retention,
      options: retentionOptions,
      optionLabel: "name",
      placeholder: "Seleccione Retenci\xF3n",
      className: "w-100",
      onChange: e => handleBillingItemChange(rowData.id, 'retention', e.value)
    })
  }, {
    field: "totalValue",
    header: "Valor total",
    body: rowData => /*#__PURE__*/React.createElement(InputNumber, {
      value: calculateLineTotal(rowData),
      className: "w-100",
      mode: "currency",
      currency: "DOP",
      locale: "es-DO",
      readOnly: true
    })
  }, {
    field: "actions",
    header: "Acciones",
    body: rowData => /*#__PURE__*/React.createElement(Button, {
      className: "p-button-rounded p-button-danger p-button-text",
      onClick: () => removeBillingItem(rowData.id),
      disabled: billingItems.length <= 1,
      tooltip: "Eliminar item"
    }, " ", /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-trash"
    }))
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "h3 mb-0 text-primary"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-file-edit me-2"
  }), "Crear Documento Soportes"))))), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit(save)
  }, /*#__PURE__*/React.createElement("div", {
    className: "card mb-4 shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-header bg-light"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "h5 mb-0"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-user-edit me-2 text-primary"
  }), "Informaci\xF3n b\xE1sica")), /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Tipo *"), /*#__PURE__*/React.createElement(Controller, {
    name: "noteType",
    control: control,
    rules: {
      required: 'Campo obligatorio'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Dropdown, _extends({}, field, {
      options: noteTypeOptions,
      optionLabel: "name",
      placeholder: "D\xE9bito/Cr\xE9dito",
      className: "w-100"
    }))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Fecha de elaboraci\xF3n *"), /*#__PURE__*/React.createElement(Controller, {
    name: "elaborationDate",
    control: control,
    rules: {
      required: 'Campo obligatorio'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Calendar, _extends({}, field, {
      placeholder: "Seleccione fecha",
      className: "w-100",
      showIcon: true,
      dateFormat: "dd/mm/yy"
    }))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Proveedor *"), /*#__PURE__*/React.createElement(Controller, {
    name: "supplier",
    control: control,
    rules: {
      required: 'Campo obligatorio'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Dropdown, _extends({}, field, {
      options: supplierOptions,
      optionLabel: "name",
      placeholder: "Seleccione proveedor",
      className: "w-100"
    }))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "N\xFAmero de factura proveedor *"), /*#__PURE__*/React.createElement(Controller, {
    name: "supplierInvoiceNumber",
    control: control,
    rules: {
      required: 'Campo obligatorio'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputText, _extends({}, field, {
      placeholder: "Ingrese n\xFAmero de factura",
      className: "w-100"
    }))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Centro de costo *"), /*#__PURE__*/React.createElement(Controller, {
    name: "costCenter",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Dropdown, _extends({}, field, {
      options: costCenterOptions,
      optionLabel: "name",
      placeholder: "Seleccione centro",
      className: "w-100"
    }))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "C\xF3digo consecutivo"), /*#__PURE__*/React.createElement(Controller, {
    name: "consecutiveCode",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputText, _extends({}, field, {
      placeholder: "Generado autom\xE1ticamente",
      className: "w-100",
      readOnly: true
    }))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center gap-2"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "applyDiscount",
    className: "mb-0 ms-2"
  }, "% Dscto"), /*#__PURE__*/React.createElement(Controller, {
    name: "applyDiscount",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Checkbox, {
      inputId: "applyDiscount",
      checked: field.value,
      onChange: e => field.onChange(e.checked)
    })
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "card mb-4 shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-header bg-light d-flex justify-content-between align-items-center"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "h5 mb-0"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-shopping-cart me-2 text-primary"
  }), "Informaci\xF3n de Facturaci\xF3n"), /*#__PURE__*/React.createElement(Button, {
    icon: "pi pi-plus",
    label: "A\xF1adir",
    className: "btn btn-primary",
    onClick: addBillingItem
  })), /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "table-responsive"
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: billingItems,
    responsiveLayout: "scroll",
    emptyMessage: "No hay items agregados",
    className: "p-datatable-sm",
    showGridlines: true,
    stripedRows: true
  }, billingItemColumns.map((col, i) => /*#__PURE__*/React.createElement(Column, {
    key: i,
    field: col.field,
    header: col.header,
    body: col.body,
    style: {
      minWidth: '150px'
    }
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "card mb-4 shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-header bg-light d-flex justify-content-between align-items-center"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "h5 mb-0"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-credit-card me-2 text-primary"
  }), "M\xE9todos de Pago (DOP)"), /*#__PURE__*/React.createElement(Button, {
    icon: "pi pi-plus",
    label: "Agregar M\xE9todo",
    className: "btn btn-primary",
    onClick: addPaymentMethod
  })), /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, paymentMethods.map(payment => /*#__PURE__*/React.createElement("div", {
    key: payment.id,
    className: "row g-3 mb-3 align-items-end"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "M\xE9todo *"), /*#__PURE__*/React.createElement(Dropdown, {
    value: payment.method,
    options: paymentMethodOptions,
    optionLabel: "name",
    placeholder: "Seleccione m\xE9todo",
    className: "w-100",
    onChange: e => handlePaymentMethodChange(payment.id, 'method', e.value)
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "N\xB0 Autorizaci\xF3n"), /*#__PURE__*/React.createElement(InputText, {
    value: payment.authorizationNumber,
    placeholder: "N\xFAmero de autorizaci\xF3n",
    className: "w-100",
    onChange: e => handlePaymentMethodChange(payment.id, 'authorizationNumber', e.target.value)
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Valor *"), /*#__PURE__*/React.createElement(InputNumber, {
    value: payment.value,
    placeholder: "Valor",
    className: "w-100",
    mode: "currency",
    currency: "DOP",
    locale: "es-DO",
    min: 0,
    onValueChange: e => handlePaymentMethodChange(payment.id, 'value', e.value || 0)
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-1"
  }, /*#__PURE__*/React.createElement(Button, {
    className: "p-button-rounded p-button-danger p-button-text",
    onClick: () => removePaymentMethod(payment.id),
    disabled: paymentMethods.length <= 1,
    tooltip: "Eliminar m\xE9todo"
  }, " ", /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-trash"
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "row mt-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "alert alert-info",
    style: {
      background: "rgb(194 194 194 / 85%)",
      border: "none",
      color: "black"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Total nota:"), /*#__PURE__*/React.createElement(InputNumber, {
    value: calculateTotal(),
    className: "ms-2",
    mode: "currency",
    currency: "DOP",
    locale: "es-DO",
    minFractionDigits: 2,
    maxFractionDigits: 3,
    readOnly: true
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Total pagos:"), /*#__PURE__*/React.createElement(InputNumber, {
    value: calculateTotalPayments(),
    className: "ms-2",
    mode: "currency",
    currency: "DOP",
    locale: "es-DO",
    minFractionDigits: 2,
    maxFractionDigits: 3,
    readOnly: true
  })), /*#__PURE__*/React.createElement("div", null, !paymentCoverage() ? /*#__PURE__*/React.createElement("span", {
    className: "text-danger"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-exclamation-triangle me-1"
  }), "Faltan ", (calculateTotal() - calculateTotalPayments()).toFixed(2), " DOP") : /*#__PURE__*/React.createElement("span", {
    className: "text-success"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-check-circle me-1"
  }), "Pagos completos")))))))), /*#__PURE__*/React.createElement("div", {
    className: "card mb-4 shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-header bg-light"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "h5 mb-0"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-calculator me-2 text-primary"
  }), "Totales (DOP)")), /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Subtotal"), /*#__PURE__*/React.createElement(InputNumber, {
    value: calculateSubtotal(),
    className: "w-100",
    mode: "currency",
    currency: "DOP",
    locale: "es-DO",
    readOnly: true
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Descuento"), /*#__PURE__*/React.createElement(InputNumber, {
    value: calculateTotalDiscount(),
    className: "w-100",
    mode: "currency",
    currency: "DOP",
    locale: "es-DO",
    readOnly: true
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Subtotal con descuento"), /*#__PURE__*/React.createElement(InputNumber, {
    value: calculateSubtotalAfterDiscount(),
    className: "w-100",
    mode: "currency",
    currency: "DOP",
    locale: "es-DO",
    readOnly: true
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Impuestos"), /*#__PURE__*/React.createElement(InputNumber, {
    value: calculateTotalTax(),
    className: "w-100",
    mode: "currency",
    currency: "DOP",
    locale: "es-DO",
    readOnly: true
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Retenci\xF3n"), /*#__PURE__*/React.createElement(InputNumber, {
    value: calculateTotalWithholdingTax(),
    className: "w-100",
    mode: "currency",
    currency: "DOP",
    locale: "es-DO",
    readOnly: true
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Total"), /*#__PURE__*/React.createElement(InputNumber, {
    value: calculateTotal(),
    className: "w-100 font-weight-bold",
    mode: "currency",
    currency: "DOP",
    locale: "es-DO",
    readOnly: true
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end gap-3 mb-4"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Guardar",
    icon: "pi pi-check",
    className: "btn-info",
    type: "submit"
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Guardar y Enviar",
    icon: "pi pi-send",
    className: "btn-info",
    onClick: handleSubmit(saveAndSend),
    disabled: !paymentCoverage()
  }))))), /*#__PURE__*/React.createElement(Toast, {
    ref: el => window['toast'] = el
  }));
};