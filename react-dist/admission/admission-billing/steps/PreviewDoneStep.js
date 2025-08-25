import React, { useState } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Divider } from "primereact/divider";
import { Tag } from "primereact/tag";
import { Panel } from "primereact/panel";
import { Badge } from "primereact/badge";
import { calculateTotal, calculatePaid, calculateChange } from "../utils/helpers.js";
import { paymentMethodOptions } from "../utils/constants.js";
const PreviewDoneStep = ({
  formData,
  prevStep,
  onHide,
  onPrint,
  onSubmit
}) => {
  const [isDone, setIsDone] = useState(false);
  const total = calculateTotal(formData.products, formData.billing.facturacionEntidad);
  const paid = calculatePaid(formData.payments);
  const change = calculateChange(total, paid);
  const balance = total - paid;
  const handleFinish = async () => {
    try {
      await onSubmit();
      setIsDone(true);
    } catch (error) {
      console.error('Error finishing invoice:', error);
    }
  };
  const formatCurrency = value => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP',
      minimumFractionDigits: 2
    }).format(value);
  };
  const paymentMethodTemplate = rowData => {
    const methodLabel = paymentMethodOptions.find(m => m.value === rowData.method)?.label || rowData.method;
    return /*#__PURE__*/React.createElement("div", {
      className: "d-flex align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: `pi ${rowData.method === 'CASH' ? 'pi-money-bill' : 'pi-credit-card'} mr-2`
    }), /*#__PURE__*/React.createElement("span", null, methodLabel));
  };
  const priceBodyTemplate = rowData => {
    return /*#__PURE__*/React.createElement("span", {
      className: "fw-bold"
    }, formatCurrency(rowData.currentPrice));
  };
  const taxBodyTemplate = rowData => {
    return /*#__PURE__*/React.createElement(Tag, {
      value: `${rowData.tax}%`,
      severity: "info",
      className: "p-tag-rounded"
    });
  };
  const subtotalBodyTemplate = rowData => {
    const subtotal = rowData.currentPrice * rowData.quantity * (1 + rowData.tax / 100);
    return /*#__PURE__*/React.createElement("span", {
      className: "fw-bold"
    }, formatCurrency(subtotal));
  };
  const paymentAmountTemplate = rowData => {
    return /*#__PURE__*/React.createElement("span", {
      className: "font-bold"
    }, formatCurrency(rowData.total));
  };
  const paymentChangeTemplate = rowData => {
    return /*#__PURE__*/React.createElement("span", {
      className: "font-bold"
    }, formatCurrency(rowData.change));
  };
  if (isDone) {
    return /*#__PURE__*/React.createElement("div", {
      className: "text-center py-6 px-4 bg-light rounded-3 shadow-sm",
      style: {
        maxWidth: '600px',
        margin: '0 auto'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "pi pi-check-circle text-6xl text-success mb-4"
    }), /*#__PURE__*/React.createElement("h2", {
      className: "mb-3 fw-bold"
    }, "\xA1Factura Generada Exitosamente!"), /*#__PURE__*/React.createElement("p", {
      className: "text-lg text-muted mb-5"
    }, "La transacci\xF3n ha sido completada y guardada en el sistema"), /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-center gap-3"
    }, /*#__PURE__*/React.createElement(Button, {
      label: "Imprimir Factura",
      icon: "pi pi-print mr-2",
      className: "btn btn-outline-primary btn-lg",
      onClick: onPrint
    }), /*#__PURE__*/React.createElement(Button, {
      label: "Volver al Inicio",
      icon: "pi pi-home mr-2",
      className: "btn btn-primary btn-lg",
      onClick: onHide
    })));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-4"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "m-0 text-primary"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-file-invoice me-2"
  }), "Vista Previa de Factura")), /*#__PURE__*/React.createElement(Panel, {
    header: "Datos del Cliente",
    toggleable: true,
    className: "mb-4 shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3 p-3 bg-light rounded"
  }, /*#__PURE__*/React.createElement("label", {
    className: "d-block text-muted small mb-1"
  }, "Nombre completo"), /*#__PURE__*/React.createElement("h5", {
    className: "mb-0"
  }, `${formData.patient.firstName} ${formData.patient.lastName}`))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3 p-3 bg-light rounded"
  }, /*#__PURE__*/React.createElement("label", {
    className: "d-block text-muted small mb-1"
  }, "Documento"), /*#__PURE__*/React.createElement("h5", {
    className: "mb-0"
  }, formData.patient.documentNumber))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3 p-3 bg-light rounded"
  }, /*#__PURE__*/React.createElement("label", {
    className: "d-block text-muted small mb-1"
  }, "Ciudad"), /*#__PURE__*/React.createElement("h5", {
    className: "mb-0"
  }, formData.patient.city))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3 p-3 bg-light rounded"
  }, /*#__PURE__*/React.createElement("label", {
    className: "d-block text-muted small mb-1"
  }, "Fecha"), /*#__PURE__*/React.createElement("h5", {
    className: "mb-0"
  }, new Date().toLocaleDateString()))))), /*#__PURE__*/React.createElement(Panel, {
    header: "Detalles de la Factura",
    toggleable: true,
    className: "mb-4 shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-4"
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: formData.products,
    className: "p-datatable-sm",
    scrollable: true,
    scrollHeight: "300px",
    stripedRows: true,
    size: "small",
    tableStyle: {
      minWidth: '50rem'
    }
  }, /*#__PURE__*/React.createElement(Column, {
    field: "id",
    header: "#",
    headerStyle: {
      width: '50px'
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "description",
    header: "Descripci\xF3n",
    headerStyle: {
      minWidth: '200px'
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "quantity",
    header: "Cantidad",
    headerStyle: {
      width: '100px'
    },
    body: rowData => /*#__PURE__*/React.createElement(Badge, {
      value: rowData.quantity,
      severity: "info"
    })
  }), /*#__PURE__*/React.createElement(Column, {
    field: "price",
    header: "Precio Unitario",
    body: priceBodyTemplate
  }), /*#__PURE__*/React.createElement(Column, {
    field: "tax",
    header: "Impuesto",
    body: taxBodyTemplate
  }), /*#__PURE__*/React.createElement(Column, {
    field: "total",
    header: "Subtotal",
    body: subtotalBodyTemplate
  }))), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-lg-6 mb-4 mb-lg-0"
  }, /*#__PURE__*/React.createElement(Panel, {
    header: "M\xE9todos de Pago",
    toggleable: true
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: formData.payments,
    className: "p-datatable-sm",
    stripedRows: true,
    size: "small"
  }, /*#__PURE__*/React.createElement(Column, {
    field: "method",
    header: "M\xE9todo",
    body: paymentMethodTemplate
  }), /*#__PURE__*/React.createElement(Column, {
    field: "amount",
    header: "Monto",
    body: paymentAmountTemplate
  }), /*#__PURE__*/React.createElement(Column, {
    field: "change",
    header: "Cambio",
    body: paymentChangeTemplate
  })))), /*#__PURE__*/React.createElement("div", {
    className: "col-lg-6"
  }, /*#__PURE__*/React.createElement(Panel, {
    header: "Resumen de Pagos",
    toggleable: true
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-muted"
  }, "Subtotal:"), /*#__PURE__*/React.createElement("span", {
    className: "fw-bold"
  }, formatCurrency(total))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-muted"
  }, "Total a Pagar:"), /*#__PURE__*/React.createElement("span", {
    className: "fw-bold"
  }, formatCurrency(total))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-muted"
  }, "Pagado:"), /*#__PURE__*/React.createElement("span", {
    className: "fw-bold text-success"
  }, formatCurrency(paid))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-muted"
  }, balance > 0 ? 'Saldo Pendiente:' : 'Cambio a Devolver:'), /*#__PURE__*/React.createElement("span", {
    className: `fw-bold ${balance > 0 ? 'text-danger' : 'text-success'}`
  }, formatCurrency(Math.abs(balance)))), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center pt-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "h5 mb-0"
  }, "Total Factura:"), /*#__PURE__*/React.createElement("span", {
    className: "h4 mb-0 text-primary"
  }, formatCurrency(total)))))))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-center gap-3 mt-5 mb-4"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Imprimir Factura",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-file-pdf"
    }),
    className: "btn btn-primary btn-lg px-4",
    onClick: onPrint
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Guardar Factura",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-cart-plus"
    }),
    className: "btn btn-primary btn-lg px-4",
    onClick: handleFinish
  })));
};
export default PreviewDoneStep;