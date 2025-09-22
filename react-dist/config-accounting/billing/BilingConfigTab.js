function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { TabView, TabPanel } from "primereact/tabview";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { useBillings } from "../../billing/hooks/useBillings.js";
import { stringToDate } from "../../../services/utilidades.js";
const BillingConfigTab = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [cuentasContables, setCuentasContables] = useState([]);
  const [loading, setLoading] = useState({
    cuentas: false,
    saving: false
  });
  const {
    register: registerFiscal,
    handleSubmit: handleFiscal,
    reset: resetFiscal,
    setValue: setValueFiscal,
    watch: watchFiscal,
    formState: {
      errors: errorsFiscal
    }
  } = useForm();
  const {
    fetchBillings,
    billings
  } = useBillings();
  const {
    register: registerConsumidor,
    handleSubmit: handleConsumidor,
    reset: resetConsumidor,
    setValue: setValueConsumidor,
    watch: watchConsumidor,
    formState: {
      errors: errorsConsumidor
    }
  } = useForm();
  const {
    register: registerGubernamental,
    handleSubmit: handleGubernamental,
    reset: resetGubernamental,
    setValue: setValueGubernamental,
    watch: watchGubernamental,
    formState: {
      errors: errorsGubernamental
    }
  } = useForm();
  const {
    register: registerNotaCredito,
    handleSubmit: handleNotaCredito,
    reset: resetNotaCredito,
    setValue: setValueNotaCredito,
    watch: watchNotaCredito,
    formState: {
      errors: errorsNotaCredito
    }
  } = useForm();
  const {
    register: registerNotaDebito,
    handleSubmit: handleNotaDebito,
    reset: resetNotaDebito,
    setValue: setValueNotaDebito,
    watch: watchNotaDebito,
    formState: {
      errors: errorsNotaDebito
    }
  } = useForm();
  const {
    register: registerCompra,
    handleSubmit: handleCompra,
    reset: resetCompra,
    setValue: setValueCompra,
    watch: watchCompra,
    formState: {
      errors: errorsCompra
    }
  } = useForm();
  const tiposFacturacion = [{
    id: "fiscal",
    nombre: "Factura Fiscal",
    icono: "fa-solid fa-file-invoice-dollar"
  }, {
    id: "consumidor",
    nombre: "Factura Consumidor",
    icono: "pi pi-receipt"
  }, {
    id: "gubernamental",
    nombre: "Factura Gubernamental",
    icono: "pi pi-building"
  }, {
    id: "notaCredito",
    nombre: "Notas de Crédito",
    icono: "pi pi-file-edit"
  }, {
    id: "notaDebito",
    nombre: "Notas de Débito",
    icono: "pi pi-file-edit"
  }, {
    id: "compra",
    nombre: "Factura de Compra",
    icono: "pi pi-shopping-cart"
  }];
  const handleFetchError = (error, message) => {
    console.error(message, error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: message
    });
    return null;
  };

  // Load accounting accounts
  useEffect(() => {
    const cargarCuentasContables = async () => {
      setLoading(prev => ({
        ...prev,
        cuentas: true
      }));
      try {
        const response = await fetch("/api/v1/admin/accounting-accounts?per_page=all");
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        const data = await response.json();
        const cuentas = Array.isArray(data) ? data : data.data || data.accounts || [];
        setCuentasContables(cuentas.filter(cuenta => cuenta.status === "active"));
      } catch (error) {
        handleFetchError(error, "No se pudieron cargar las cuentas contables. Por favor, intente nuevamente.");
      } finally {
        setLoading(prev => ({
          ...prev,
          cuentas: false
        }));
      }
    };
    cargarCuentasContables();
    fetchBillings();
  }, []);
  useEffect(() => {
    billings.forEach(billing => {
      const resolutionDate = billing.resolution_date ? stringToDate(billing.resolution_date) : null;
      const expirationDate = billing.expiration_date ? stringToDate(billing.expiration_date) : null;
      const data = {
        ...billing,
        resolution_date: resolutionDate,
        expiration_date: expirationDate,
        accounting_account: +billing.accounting_account,
        accounting_account_discount: billing.accounting_account_discount ? +billing.accounting_account_discount : null
      };
      switch (billing.type) {
        case "tax_invoice":
          resetFiscal(data);
          break;
        case "consumer":
          resetConsumidor(data);
          break;
        case "government_invoice":
          resetGubernamental(data);
          break;
        case "credit_note":
          resetNotaCredito(data);
          break;
        case "debit_note":
          resetNotaDebito(data);
          break;
        case "purchase_invoice":
          resetCompra(data);
          break;
      }
    });
  }, [billings]);
  const filtrarCuentas = () => {
    return cuentasContables.sort((a, b) => (a.account_code || "").localeCompare(b.account_code || ""));
  };
  const guardarConfiguracion = async (tipo, data, errors, setValue) => {
    setLoading(prev => ({
      ...prev,
      saving: true
    }));
    console.log("data", data);
    console.log("errors", errors);
    console.log("tipo", tipo);
    try {
      const tipoApi = {
        fiscal: "tax_invoice",
        consumidor: "consumer",
        gubernamental: "government_invoice",
        notaCredito: "credit_note",
        notaDebito: "debit_note",
        compra: "purchase_invoice"
      }[tipo];
      if (!tipoApi) {
        throw new Error("Tipo de factura no válido");
      }
      const formatDate = date => {
        if (!date) return null;
        if (typeof date === "string") return date;
        const d = new Date(date);
        return d.toISOString().split("T")[0];
      };
      const payload = {
        dian_prefix: data.dian_prefix,
        accounting_account: data.accounting_account?.toString(),
        resolution_number: data.resolution_number,
        invoice_from: data.invoice_from,
        invoice_to: data.invoice_to,
        resolution_date: formatDate(data.resolution_date),
        expiration_date: formatDate(data.expiration_date),
        type: tipoApi
      };
      if (["fiscal", "consumidor", "gubernamental", "compra"].includes(tipo)) {
        payload.accounting_account_reverse_id = data.accounting_account_reverse_id;
        payload.accounting_account_discount = data.accounting_account_discount?.toString();
      }
      const url = "/medical/companies/1/billings";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error HTTP: ${response.status}`);
      }
      const result = await response.json();
      Swal.fire({
        icon: "success",
        title: "¡Guardado!",
        text: `Configuración de ${tiposFacturacion.find(t => t.id === tipo)?.nombre} guardada correctamente`,
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error(`Error al guardar ${tipo}:`, error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error instanceof Error ? error.message : `Error al guardar la configuración`
      });
    } finally {
      setLoading(prev => ({
        ...prev,
        saving: false
      }));
    }
  };
  const onSubmitFiscal = data => guardarConfiguracion("fiscal", data, errorsFiscal, setValueFiscal);
  const onSubmitConsumidor = data => guardarConfiguracion("consumidor", data, errorsConsumidor, setValueConsumidor);
  const onSubmitGubernamental = data => guardarConfiguracion("gubernamental", data, errorsGubernamental, setValueGubernamental);
  const onSubmitNotaCredito = data => guardarConfiguracion("notaCredito", data, errorsNotaCredito, setValueNotaCredito);
  const onSubmitNotaDebito = data => guardarConfiguracion("notaDebito", data, errorsNotaDebito, setValueNotaDebito);
  const onSubmitCompra = data => guardarConfiguracion("compra", data, errorsCompra, setValueCompra);
  const renderFormFields = (tipo, register, errors, setValue, watch) => {
    const cuentasFiltradas = filtrarCuentas();
    const accountingAccount = watch("accounting_account");
    const accountingAccountReverse = watch("accounting_account_reverse_id");
    const accountingAccountDiscount = watch("accounting_account_discount");
    const showReverseAccount = ["fiscal", "consumidor", "gubernamental", "compra"].includes(tipo);
    return /*#__PURE__*/React.createElement("div", {
      className: "grid p-fluid"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-12 md:col-6"
    }, /*#__PURE__*/React.createElement("div", {
      className: "field mb-4"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: `dian_prefix_${tipo}`,
      className: "block text-900 font-medium mb-2"
    }, "Prefijo DGII"), /*#__PURE__*/React.createElement(InputText, _extends({
      id: `dian_prefix_${tipo}`
    }, register("dian_prefix", {
      required: true
    }), {
      className: `w-full ${errors?.dian_prefix ? "p-invalid" : ""}`,
      placeholder: "Ej: ABC"
    })), errors?.dian_prefix && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, "Favor ingrese el prefijo DGII.")), !["compra"].includes(tipo) && /*#__PURE__*/React.createElement("div", {
      className: "field mb-4"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: `accounting_account_${tipo}`,
      className: "block text-900 font-medium mb-2"
    }, "Cuenta Contable"), /*#__PURE__*/React.createElement(Dropdown, {
      id: `accounting_account_${tipo}`,
      options: cuentasFiltradas.map(cuenta => ({
        label: `${cuenta.account_code} - ${cuenta.account_name}`,
        value: cuenta.id
      })),
      value: accountingAccount,
      onChange: e => setValue("accounting_account", e.value),
      filter: true,
      filterBy: "label",
      showClear: true,
      filterPlaceholder: "Buscar cuenta...",
      className: `w-full ${errors?.accounting_account ? "p-invalid" : ""}`,
      loading: loading.cuentas,
      placeholder: "Seleccione una cuenta"
    }), errors?.accounting_account && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, "Favor seleccione una cuenta contable.")), showReverseAccount && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "field mb-4"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: `accounting_account_reverse_${tipo}`,
      className: "block text-900 font-medium mb-2"
    }, "Cuenta Contable Reversa"), /*#__PURE__*/React.createElement(Dropdown, {
      id: `accounting_account_reverse_${tipo}`,
      options: cuentasFiltradas.map(cuenta => ({
        label: `${cuenta.account_code} - ${cuenta.account_name}`,
        value: cuenta.id
      })),
      value: accountingAccountReverse,
      onChange: e => setValue("accounting_account_reverse_id", e.value),
      filter: true,
      filterBy: "label",
      showClear: true,
      filterPlaceholder: "Buscar cuenta...",
      className: `w-full ${errors?.accounting_account_reverse_id ? "p-invalid" : ""}`,
      loading: loading.cuentas,
      placeholder: "Seleccione una cuenta"
    }), errors?.accounting_account_reverse_id && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, "Favor seleccione una cuenta contable reversa.")), /*#__PURE__*/React.createElement("div", {
      className: "field mb-4"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: `accounting_account_discount_${tipo}`,
      className: "block text-900 font-medium mb-2"
    }, "Cuenta Contable Descuento"), /*#__PURE__*/React.createElement(Dropdown, {
      id: `accounting_account_discount_${tipo}`,
      options: cuentasFiltradas.map(cuenta => ({
        label: `${cuenta.account_code} - ${cuenta.account_name}`,
        value: cuenta.id
      })),
      value: accountingAccountDiscount,
      onChange: e => setValue("accounting_account_discount", e.value),
      filter: true,
      filterBy: "label",
      showClear: true,
      filterPlaceholder: "Buscar cuenta...",
      className: `w-full ${errors?.accounting_account_discount ? "p-invalid" : ""}`,
      loading: loading.cuentas,
      placeholder: "Seleccione una cuenta"
    }), errors?.accounting_account_discount && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, "Favor seleccione una cuenta contable para descuentos."))), /*#__PURE__*/React.createElement("div", {
      className: "field mb-4"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: `resolution_number_${tipo}`,
      className: "block text-900 font-medium mb-2"
    }, "N\xFAmero Resoluci\xF3n"), /*#__PURE__*/React.createElement(InputText, _extends({
      id: `resolution_number_${tipo}`
    }, register("resolution_number", {
      required: true
    }), {
      className: `w-full ${errors?.resolution_number ? "p-invalid" : ""}`,
      placeholder: "Ej: 1234567890"
    })), errors?.resolution_number && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, "Favor ingrese el n\xFAmero de resoluci\xF3n."))), /*#__PURE__*/React.createElement("div", {
      className: "col-12 md:col-6"
    }, /*#__PURE__*/React.createElement("div", {
      className: "field mb-4"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: `invoice_from_${tipo}`,
      className: "block text-900 font-medium mb-2"
    }, "Facturas Desde"), /*#__PURE__*/React.createElement(InputNumber, {
      id: `invoice_from_${tipo}`,
      value: watch("invoice_from"),
      onValueChange: e => setValue("invoice_from", e.value),
      mode: "decimal",
      useGrouping: false,
      min: 1,
      className: `w-full ${errors?.invoice_from ? "p-invalid" : ""}`,
      placeholder: "Ej: 1001"
    }), errors?.invoice_from && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, "Ingrese el n\xFAmero inicial de facturas.")), /*#__PURE__*/React.createElement("div", {
      className: "field mb-4"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: `invoice_to_${tipo}`,
      className: "block text-900 font-medium mb-2"
    }, "Facturas Hasta"), /*#__PURE__*/React.createElement(InputNumber, {
      id: `invoice_to_${tipo}`,
      value: watch("invoice_to"),
      onValueChange: e => setValue("invoice_to", e.value),
      mode: "decimal",
      useGrouping: false,
      min: 1,
      className: `w-full ${errors?.invoice_to ? "p-invalid" : ""}`,
      placeholder: "Ej: 2000"
    }), errors?.invoice_to && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, "Ingrese el n\xFAmero final de facturas.")), /*#__PURE__*/React.createElement("div", {
      className: "field mb-4"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: `resolution_date_${tipo}`,
      className: "block text-900 font-medium mb-2"
    }, "Fecha Resoluci\xF3n"), /*#__PURE__*/React.createElement(Calendar, {
      id: `resolution_date_${tipo}`,
      value: watch("resolution_date"),
      onChange: e => setValue("resolution_date", e.value),
      dateFormat: "dd/mm/yy",
      showIcon: true,
      placeholder: "Seleccione la fecha de resoluci\xF3n",
      className: `w-full ${errors?.resolution_date ? "p-invalid" : ""}`,
      readOnlyInput: true
    }), errors?.resolution_date && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, "Seleccione la fecha de resoluci\xF3n.")), /*#__PURE__*/React.createElement("div", {
      className: "field mb-4"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: `expiration_date_${tipo}`,
      className: "block text-900 font-medium mb-2"
    }, "Fecha Vencimiento"), /*#__PURE__*/React.createElement(Calendar, {
      id: `expiration_date_${tipo}`,
      value: watch("expiration_date"),
      onChange: e => setValue("expiration_date", e.value),
      dateFormat: "dd/mm/yy",
      showIcon: true,
      placeholder: "Seleccione la fecha de vencimiento",
      className: `w-full ${errors?.expiration_date ? "p-invalid" : ""}`,
      readOnlyInput: true
    }), errors?.expiration_date && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, "Seleccione la fecha de vencimiento."))), /*#__PURE__*/React.createElement("div", {
      className: "col-12",
      style: {
        display: "flex",
        justifyContent: "center"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex justify-content-center mt-4"
    }, /*#__PURE__*/React.createElement(Button, {
      type: "submit",
      label: "Guardar Configuraci\xF3n",
      className: "p-button-sm md:p-button mx-auto",
      style: {
        width: "100%"
      },
      loading: loading.saving
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-save ms-2"
    })))));
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "p-4"
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Configuraci\xF3n de Facturaci\xF3n",
    className: "shadow-3"
  }, /*#__PURE__*/React.createElement(TabView, {
    activeIndex: activeTab,
    onTabChange: e => setActiveTab(e.index),
    className: "w-full"
  }, /*#__PURE__*/React.createElement(TabPanel, {
    header: /*#__PURE__*/React.createElement("span", {
      className: "d-flex align-items-center",
      style: {
        color: "#132030"
      }
    }, "Factura Fiscal", /*#__PURE__*/React.createElement("i", {
      className: "fas fa-file-invoice-dollar ms-1",
      style: {
        color: "#132030"
      }
    }))
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: handleFiscal(onSubmitFiscal),
    className: "w-full"
  }, renderFormFields("fiscal", registerFiscal, errorsFiscal, setValueFiscal, watchFiscal))), /*#__PURE__*/React.createElement(TabPanel, {
    header: /*#__PURE__*/React.createElement("span", {
      className: "d-flex align-items-center",
      style: {
        color: "#132030"
      }
    }, "Factura Consumidor", /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-file-invoice ms-1",
      style: {
        color: "#132030"
      }
    }))
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: handleConsumidor(onSubmitConsumidor),
    className: "w-full"
  }, renderFormFields("consumidor", registerConsumidor, errorsConsumidor, setValueConsumidor, watchConsumidor))), /*#__PURE__*/React.createElement(TabPanel, {
    header: /*#__PURE__*/React.createElement("span", {
      className: "d-flex align-items-center",
      style: {
        color: "#132030"
      }
    }, "Factura Gubernamental", /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-building-columns ms-1",
      style: {
        color: "#132030"
      }
    }))
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: handleGubernamental(onSubmitGubernamental),
    className: "w-full"
  }, renderFormFields("gubernamental", registerGubernamental, errorsGubernamental, setValueGubernamental, watchGubernamental))), /*#__PURE__*/React.createElement(TabPanel, {
    header: /*#__PURE__*/React.createElement("span", {
      className: "d-flex align-items-center",
      style: {
        color: "#132030"
      }
    }, "Notas de Cr\xE9dito", /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-money-bill-transfer ms-1",
      style: {
        color: "#132030"
      }
    }))
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: handleNotaCredito(onSubmitNotaCredito),
    className: "w-full"
  }, renderFormFields("notaCredito", registerNotaCredito, errorsNotaCredito, setValueNotaCredito, watchNotaCredito))), /*#__PURE__*/React.createElement(TabPanel, {
    header: /*#__PURE__*/React.createElement("span", {
      className: "d-flex align-items-center",
      style: {
        color: "#132030"
      }
    }, "Notas de D\xE9bito", /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-money-bill-trend-up ms-1",
      style: {
        color: "#132030"
      }
    }))
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: handleNotaDebito(onSubmitNotaDebito),
    className: "w-full"
  }, renderFormFields("notaDebito", registerNotaDebito, errorsNotaDebito, setValueNotaDebito, watchNotaDebito))), /*#__PURE__*/React.createElement(TabPanel, {
    header: /*#__PURE__*/React.createElement("span", {
      className: "d-flex align-items-center",
      style: {
        color: "#132030"
      }
    }, "Factura de Compra", /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-file-invoice ms-1",
      style: {
        color: "#132030"
      }
    }))
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: handleCompra(onSubmitCompra),
    className: "w-full"
  }, renderFormFields("compra", registerCompra, errorsCompra, setValueCompra, watchCompra))))));
};
export default BillingConfigTab;