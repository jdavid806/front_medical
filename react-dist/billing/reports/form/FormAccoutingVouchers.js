function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import { classNames } from "primereact/utils";
import { resourcesAdminService, accountingVouchersService } from "../../../../services/api/index.js";
import { getUserLogged } from "../../../../services/utilidades.js";
import { useAccountingAccounts } from "../../../accounting/hooks/useAccountingAccounts.js"; // Definición de tipos
export const FormAccoutingVouchers = ({
  voucherId = undefined,
  initialData = null,
  editTransactions = [],
  onUpdate
}) => {
  const {
    control,
    handleSubmit,
    formState: {
      errors
    },
    reset
  } = useForm();
  const toast = useRef(null);
  const [numberOfVoucher, setNumberOfVoucher] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const userLogged = getUserLogged();

  // Helper function to generate unique IDs
  function generateId() {
    return Math.random().toString(36).substr(2, 9);
  }

  // Opciones del tipo de transacción
  const transactionTypeOptions = [{
    label: "Débito",
    value: "debit"
  }, {
    label: "Crédito",
    value: "credit"
  }];

  // Opciones del tipo de tercero
  const thirdPartyTypeOptions = [{
    label: "Proveedor",
    value: "provider"
  }, {
    label: "Cliente",
    value: "client"
  }];
  async function loadLastAccountingEntry() {
    const data = await accountingVouchersService.getLastRow();
    setNumberOfVoucher(data.id || 0 + 1);
  }
  useEffect(() => {
    loadLastAccountingEntry();
  }, []);
  useEffect(() => {
    console.log("initialData: ", initialData);
    reset(initialData || {
      date: null
    });
  }, [initialData, reset]);
  useEffect(() => {
    if (editTransactions.length > 0) {
      console.log("editTransactions: ", editTransactions);
      setTransactions(editTransactions);
    }
  }, [initialData, editTransactions]);

  // Funciones de cálculo
  const calculateTotalDebit = () => {
    return transactions.reduce((total, transaction) => {
      return transaction.type === "debit" ? total + (transaction.amount || 0) : total;
    }, 0);
  };
  const calculateTotalCredit = () => {
    return transactions.reduce((total, transaction) => {
      return transaction.type === "credit" ? total + (transaction.amount || 0) : total;
    }, 0);
  };
  const isBalanced = () => {
    return calculateTotalDebit() === calculateTotalCredit();
  };

  // Funciones para manejar transacciones
  const addTransaction = () => {
    setTransactions([...transactions, {
      id: generateId(),
      account: null,
      type: null,
      thirdPartyType: null,
      thirdParty: null,
      amount: null,
      description: ""
    }]);
  };
  const removeTransaction = id => {
    if (transactions.length > 1) {
      setTransactions(transactions.filter(transaction => transaction.id !== id));
    } else {
      toast.current?.show({
        severity: "warn",
        summary: "Advertencia",
        detail: "Debe tener al menos una transacción",
        life: 3000
      });
    }
  };
  const handleTransactionChange = (id, field, value) => {
    setTransactions(prevTransactions => prevTransactions.map(transaction => transaction.id === id ? {
      ...transaction,
      [field]: value
    } : transaction));
  };
  const save = async formData => {
    if (!isBalanced()) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "El comprobante no está balanceado (Débitos ≠ Créditos)",
        life: 5000
      });
      return;
    }
    let formattedData = {
      description: formData.observations || "Sin observaciones",
      seat_date: formData.date ? formatDate(formData.date) : formatDate(new Date()),
      seat_number: `AS-${formatDate(new Date())}${initialData?.id || numberOfVoucher}`,
      status: "approved",
      total_should_be: calculateTotalDebit(),
      total_is: calculateTotalCredit(),
      user_id: userLogged.id,
      details: transactions.map(transaction => ({
        accounting_account_id: transaction.account || 0,
        amount: transaction.amount || 0,
        type: transaction.type?.toLowerCase() || "",
        // "DEBITO" -> "debit", "CREDITO" -> "credit"
        description: transaction.description || "",
        third_party_id: transaction.thirdParty || 0
      }))
    };
    if (voucherId) {
      formattedData = {
        description: formData.observations || "Sin observaciones",
        seat_date: formData.date ? formatDate(formData.date) : formatDate(new Date()),
        total_should_be: calculateTotalDebit(),
        total_is: calculateTotalCredit(),
        user_id: userLogged.id,
        details: transactions.map(transaction => ({
          accounting_account_id: transaction.account || 0,
          amount: transaction.amount || 0,
          type: transaction.type?.toLowerCase() || "",
          // "DEBITO" -> "debit", "CREDITO" -> "credit"
          description: transaction.description || "",
          third_party_id: transaction.thirdParty || 0
        }))
      };
      await accountingVouchersService.updateAccountingVouchers(voucherId, formattedData).then(response => {
        toast.current?.show({
          severity: "success",
          summary: "Éxito",
          detail: "Comprobante contable guardado correctamente",
          life: 3000
        });
        onUpdate && onUpdate();
      }).catch(error => {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Erro al guardar comprobante contable",
          life: 3000
        });
      });
    } else {
      await accountingVouchersService.storeAccountingVouchers(formattedData).then(response => {
        toast.current?.show({
          severity: "success",
          summary: "Éxito",
          detail: "Comprobante contable guardado correctamente",
          life: 3000
        });
        setTimeout(() => {
          window.location.href = 'ComprobantesContables';
        }, 2000);
      }).catch(error => {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Erro al guardar comprobante contable",
          life: 3000
        });
      });
    }
  };

  // Función auxiliar para formatear fechas
  function formatDate(date) {
    const d = new Date(date);
    let month = "" + (d.getMonth() + 1);
    let day = "" + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    return [year, month, day].join("-");
  }
  const saveAndSend = async formData => {
    const formattedData = {
      description: formData.observations || "Sin observaciones",
      seat_date: formData.date ? formatDate(formData.date) : formatDate(new Date()),
      seat_number: `AS-${formatDate(new Date())}${initialData?.id || numberOfVoucher}`,
      status: "approved",
      total_should_be: calculateTotalDebit(),
      total_is: calculateTotalCredit(),
      user_id: userLogged.id,
      details: transactions.map(transaction => ({
        accounting_account_id: transaction.account || 0,
        amount: transaction.amount || 0,
        type: transaction.type?.toLowerCase() || "",
        // "DEBITO" -> "debit", "CREDITO" -> "credit"
        description: transaction.description || "",
        third_party_id: transaction.thirdParty || 0
      }))
    };

    // Aquí iría la llamada al API para guardar y enviar
    await accountingVouchersService.storeAccountingVouchers(formattedData).then(response => {
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Comprobante contable guardado correctamente",
        life: 3000
      });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }).catch(error => {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Erro al guardar comprobante contable",
        life: 3000
      });
    });
  };
  const cancel = () => {
    console.log("Cancelando creación de comprobante...");
  };

  // Columnas para la tabla de transacciones
  const transactionColumns = [{
    field: "account",
    header: "Cuenta Contable",
    body: rowData => /*#__PURE__*/React.createElement(AccountingAccountField, {
      rowData: rowData,
      onChange: value => handleTransactionChange(rowData.id, "account", value)
    })
  }, {
    field: "type",
    width: "300px",
    header: "Tipo",
    body: rowData => /*#__PURE__*/React.createElement(Dropdown, {
      value: rowData.type,
      options: transactionTypeOptions,
      placeholder: "Seleccione tipo",
      className: "w-100 dropdown-accounting-voucher",
      style: {
        width: "100vw"
      },
      onChange: e => handleTransactionChange(rowData.id, "type", e.value)
    })
  }, {
    field: "thirdPartyType",
    header: "Tipo de Tercero",
    body: rowData => /*#__PURE__*/React.createElement(Dropdown, {
      value: rowData.thirdPartyType,
      options: thirdPartyTypeOptions,
      placeholder: "Seleccione tipo",
      className: "w-100 dropdown-accounting-voucher",
      style: {
        width: "100vw"
      },
      onChange: e => {
        handleTransactionChange(rowData.id, "thirdPartyType", e.value);
      }
    })
  }, {
    field: "thirdParty",
    header: "Terceros",
    body: rowData => /*#__PURE__*/React.createElement(ThirdPartyField, {
      rowData: rowData,
      onChange: value => handleTransactionChange(rowData.id, "thirdParty", value)
    })
  }, {
    field: "amount",
    header: "Monto",
    body: rowData => /*#__PURE__*/React.createElement(InputNumber, {
      value: rowData.amount,
      placeholder: "0.00",
      className: "w-full",
      mode: "currency",
      currency: "DOP",
      locale: "es-DO",
      onValueChange: e => handleTransactionChange(rowData.id, "amount", e.value)
    })
  }, {
    field: "description",
    header: "Descripción",
    body: rowData => /*#__PURE__*/React.createElement(InputText, {
      value: rowData.description,
      placeholder: "Ingrese descripci\xF3n",
      className: "w-full",
      onChange: e => handleTransactionChange(rowData.id, "description", e.target.value)
    })
  }, {
    field: "actions",
    header: "Acciones",
    body: rowData => /*#__PURE__*/React.createElement(Button, {
      className: "p-button-rounded p-button-danger p-button-text",
      onClick: () => removeTransaction(rowData.id),
      tooltip: "Eliminar transacci\xF3n",
      tooltipOptions: {
        position: "top"
      },
      type: "button"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-trash"
    }))
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid p-4"
  }, /*#__PURE__*/React.createElement("div", {
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
    className: "pi pi-info-circle me-2 text-primary"
  }), "Informaci\xF3n b\xE1sica")), /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "N\xFAmero de comprobante *"), /*#__PURE__*/React.createElement(Controller, {
    name: "invoiceNumber",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputText, _extends({}, field, {
      value: initialData?.id || "#" + numberOfVoucher,
      placeholder: "Generado autom\xE1ticamente",
      className: "w-100",
      readOnly: true
    }))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Fecha *"), /*#__PURE__*/React.createElement(Controller, {
    name: "date",
    control: control,
    rules: {
      required: "Campo obligatorio"
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Calendar, _extends({}, field, {
      placeholder: "Seleccione fecha",
      className: classNames("w-100", {
        "p-invalid": fieldState.error
      }),
      showIcon: true,
      dateFormat: "dd/mm/yy"
    })), fieldState.error && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, fieldState.error.message))
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "card mb-4 shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-header bg-light d-flex justify-content-between align-items-center"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "h5 mb-0"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-credit-card me-2 text-primary"
  }), "Transacciones contables"), /*#__PURE__*/React.createElement(Button, {
    icon: "pi pi-plus",
    label: "Agregar transacci\xF3n",
    className: "btn btn-primary",
    type: "button",
    onClick: addTransaction
  })), /*#__PURE__*/React.createElement("div", {
    className: "card-body p-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "table-responsive",
    style: {
      overflowX: 'auto'
    }
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: transactions,
    responsiveLayout: "scroll",
    emptyMessage: "Por favor agrega transacciones",
    className: "p-datatable-sm",
    showGridlines: true,
    stripedRows: true,
    scrollable: true,
    scrollHeight: "flex",
    style: {
      minWidth: '100%',
      width: '100%'
    }
  }, transactionColumns.map((col, i) => /*#__PURE__*/React.createElement(Column, {
    key: i,
    field: col.field,
    header: col.header,
    body: col.body,
    style: {
      minWidth: "200px !important"
    }
  })))), /*#__PURE__*/React.createElement("div", {
    className: "row mt-3 p-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "alert alert-info",
    style: {
      background: "rgb(194 194 194 / 85%)",
      border: "none",
      color: "black"
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Total d\xE9bitos:"), /*#__PURE__*/React.createElement(InputNumber, {
    value: calculateTotalDebit(),
    className: "ms-2",
    mode: "currency",
    currency: "DOP",
    locale: "es-DO",
    readOnly: true
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "alert alert-info",
    style: {
      background: "rgb(194 194 194 / 85%)",
      border: "none",
      color: "black"
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Total cr\xE9ditos:"), /*#__PURE__*/React.createElement(InputNumber, {
    value: calculateTotalCredit(),
    className: "ms-2",
    mode: "currency",
    currency: "DOP",
    locale: "es-DO",
    readOnly: true
  }), !isBalanced() && /*#__PURE__*/React.createElement("span", {
    className: "text-danger ms-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-exclamation-triangle"
  }), " El comprobante no est\xE1 balanceado")))))), /*#__PURE__*/React.createElement("div", {
    className: "card mb-4 shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-header bg-light"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "h5 mb-0"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-comment me-2 text-primary"
  }), "Observaciones")), /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "observations",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputTextarea, _extends({}, field, {
      rows: 5,
      className: "w-100",
      placeholder: "Ingrese observaciones relevantes"
    }))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end gap-3 mb-4"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    icon: "pi pi-times",
    className: "p-button-secondary",
    onClick: cancel
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Guardar",
    icon: "pi pi-check",
    className: "btn-info",
    type: "submit",
    disabled: !isBalanced()
  }))))), /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }));
};
const AccountingAccountField = ({
  rowData,
  onChange
}) => {
  const {
    accounts,
    isLoading,
    error
  } = useAccountingAccounts();

  /*
  const [accountingAccounts, setAccountingAccounts] = useState<any[]>([]);
  const loadAccountingAcounts = async () => {
  
  const response = await accountingAccountsService.getAllAccounts();
  console.log("Accounts: ", response.data);
    setAccountingAccounts(response.data);
  };
  useEffect(() => {
  loadAccountingAcounts();
  }, []);
  */
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Dropdown, {
    value: rowData.account,
    options: accounts,
    optionLabel: "account_label",
    optionValue: "id",
    placeholder: "Seleccione cuenta",
    onChange: e => onChange(e.value),
    filter: true,
    showClear: true,
    className: "w-100",
    style: {
      width: "100vw"
    },
    appendTo: document.body
  }));
};
const ThirdPartyField = ({
  rowData,
  onChange
}) => {
  const [allThirdParties, setAllThirdParties] = useState([]); // Todos los terceros
  const toast = useRef(null);
  const loadThirdParties = async () => {
    try {
      const response = await resourcesAdminService.getThirdParties();
      console.log("Terceros: ", response.data);
      setAllThirdParties(response.data); // Guardamos todos los terceros
    } catch (error) {
      console.error("Error cargando terceros:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron cargar los terceros",
        life: 3000
      });
    }
  };
  const getFilteredThirdParties = thirdPartyType => {
    if (!thirdPartyType) return [];
    return allThirdParties.filter(thirdParty => {
      if (thirdPartyType === "provider") {
        return thirdParty.type === "provider";
      } else if (thirdPartyType === "client") {
        return thirdParty.type === "client";
      }
      return false;
    });
  };
  useEffect(() => {
    loadThirdParties();
  }, []);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Dropdown, {
    value: rowData.thirdParty,
    options: getFilteredThirdParties(rowData.thirdPartyType),
    optionLabel: "name",
    optionValue: "id",
    placeholder: "Seleccione tercero",
    onChange: e => onChange(e.value),
    filter: true,
    showClear: true,
    className: "w-100 dropdown-accounting-voucher",
    appendTo: document.body
  }));
};