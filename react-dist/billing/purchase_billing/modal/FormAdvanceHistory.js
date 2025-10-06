import React, { useRef, useState, useEffect } from "react";
import { useQuery } from "react-query";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { InvoiceService } from "../../../services/api/classes/invoiceService.js";
import { Toast } from "primereact/toast";
const AdvanceHistoryForm = ({
  customerId,
  invoiceTotal,
  onSelectAdvances
}) => {
  const [selectedAdvances, setSelectedAdvances] = useState([]);
  const [remainingAmount, setRemainingAmount] = useState(invoiceTotal);
  const toastRef = useRef(null);

  // Fetch customer advances
  const {
    data: advances,
    isLoading
  } = useQuery(["customerAdvances", customerId], async () => {
    if (!customerId) return [];
    const invoiceService = new InvoiceService();
    const response = await invoiceService.getCustomerAdvances(customerId);
    return response.data;
  }, {
    enabled: !!customerId
  });
  useEffect(() => {
    setRemainingAmount(invoiceTotal);
    setSelectedAdvances([]);
  }, [invoiceTotal, customerId]);
  const handleSelectAdvance = advance => {
    const alreadySelected = selectedAdvances.some(a => a.id === advance.id);
    if (alreadySelected) {
      setSelectedAdvances(prev => prev.filter(a => a.id !== advance.id));
      setRemainingAmount(prev => prev + (advance.amount_to_use || advance.available_amount));
    } else {
      if (remainingAmount <= 0) {
        toastRef.current?.show({
          severity: "warn",
          summary: "Advertencia",
          detail: "El total de la factura ya ha sido cubierto",
          life: 3000
        });
        return;
      }
      const amountToUse = Math.min(remainingAmount, advance.available_amount);
      const adjustedAdvance = {
        ...advance,
        amount_to_use: amountToUse
      };
      setSelectedAdvances(prev => [...prev, adjustedAdvance]);
      setRemainingAmount(prev => prev - amountToUse);
    }
  };
  const handleAmountChange = (advanceId, value) => {
    setSelectedAdvances(prev => prev.map(advance => advance.id === advanceId ? {
      ...advance,
      amount_to_use: value
    } : advance));

    // Recalculate remaining amount
    const totalSelected = selectedAdvances.reduce((sum, a) => {
      return sum + (a.id === advanceId ? value : a.amount_to_use || 0);
    }, 0);
    setRemainingAmount(invoiceTotal - totalSelected);
  };
  const confirmSelection = () => {
    onSelectAdvances(selectedAdvances);
  };
  const amountBodyTemplate = rowData => {
    if (selectedAdvances.some(a => a.id === rowData.id)) {
      const selectedAdv = selectedAdvances.find(a => a.id === rowData.id);
      const maxAmount = Math.min(rowData.available_amount, remainingAmount + (selectedAdv?.amount_to_use || 0));
      return /*#__PURE__*/React.createElement(InputNumber, {
        value: selectedAdv?.amount_to_use,
        onValueChange: e => handleAmountChange(rowData.id, e.value || 0),
        mode: "currency",
        currency: "DOP",
        min: 0,
        max: maxAmount
      });
    }
    return /*#__PURE__*/React.createElement("span", null, rowData.amount.toLocaleString("es-DO", {
      style: "currency",
      currency: "DOP"
    }));
  };
  const availableAmountBodyTemplate = rowData => {
    return /*#__PURE__*/React.createElement("span", null, rowData.available_amount.toLocaleString("es-DO", {
      style: "currency",
      currency: "DOP"
    }));
  };
  const dateBodyTemplate = rowData => {
    return new Date(rowData.date).toLocaleDateString("es-DO");
  };
  const actionBodyTemplate = rowData => {
    const isSelected = selectedAdvances.some(a => a.id === rowData.id);
    return /*#__PURE__*/React.createElement(Button, {
      icon: isSelected ? "pi pi-check" : "pi pi-plus",
      className: `p-button-sm ${isSelected ? "p-button-success" : "p-button-primary"}`,
      onClick: () => handleSelectAdvance(rowData),
      disabled: rowData.available_amount <= 0 && !isSelected,
      tooltip: rowData.available_amount <= 0 ? "Anticipo ya utilizado" : ""
    });
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Toast, {
    ref: toastRef
  }), /*#__PURE__*/React.createElement("div", {
    className: "p-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-4 p-4 border-round",
    style: {
      backgroundColor: "#f8f9fa"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-6"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "m-0"
  }, "Total factura:", " ", invoiceTotal.toLocaleString("es-DO", {
    style: "currency",
    currency: "DOP"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-6"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "m-0"
  }, "Restante:", /*#__PURE__*/React.createElement("span", {
    className: remainingAmount > 0 ? "text-danger" : "text-success"
  }, " ", remainingAmount.toLocaleString("es-DO", {
    style: "currency",
    currency: "DOP"
  })))))), /*#__PURE__*/React.createElement(DataTable, {
    value: advances || [],
    loading: isLoading,
    paginator: true,
    rows: 5,
    rowsPerPageOptions: [5, 10, 20],
    emptyMessage: "No se encontraron anticipos para este cliente",
    selectionMode: "single",
    selection: selectedAdvances,
    onSelectionChange: e => setSelectedAdvances(e.value),
    dataKey: "id"
  }, /*#__PURE__*/React.createElement(Column, {
    field: "date",
    header: "Fecha",
    body: dateBodyTemplate,
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "amount",
    header: "Monto Total",
    body: amountBodyTemplate,
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "available_amount",
    header: "Disponible",
    body: availableAmountBodyTemplate,
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "payment_method",
    header: "M\xE9todo de Pago",
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "reference",
    header: "Referencia",
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    body: actionBodyTemplate,
    style: {
      width: "6rem"
    }
  }))));
};
export default AdvanceHistoryForm;