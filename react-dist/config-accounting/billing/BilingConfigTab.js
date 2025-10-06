function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { TabView, TabPanel } from "primereact/tabview";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Badge } from "primereact/badge";
import { useBillings } from "../../billing/hooks/useBillings.js";
import { stringToDate } from "../../../services/utilidades.js";
const BillingConfigTab = ({
  onValidationChange,
  onConfigurationComplete
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [cuentasContables, setCuentasContables] = useState([]);
  const [savedConfigs, setSavedConfigs] = useState(new Set());
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState({
    cuentas: false,
    saving: false
  });

  // Detectar tamaño de pantalla
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
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
    icono: "fa-solid fa-file-invoice-dollar",
    apiType: "tax_invoice",
    shortName: "Fiscal"
  }, {
    id: "consumidor",
    nombre: "Factura Consumidor",
    icono: "pi pi-receipt",
    apiType: "consumer",
    shortName: "Consumidor"
  }, {
    id: "gubernamental",
    nombre: "Factura Gubernamental",
    icono: "pi pi-building",
    apiType: "government_invoice",
    shortName: "Gubernamental"
  }, {
    id: "notaCredito",
    nombre: "Notas de Crédito",
    icono: "pi pi-file-edit",
    apiType: "credit_note",
    shortName: "N. Crédito"
  }, {
    id: "notaDebito",
    nombre: "Notas de Débito",
    icono: "pi pi-file-edit",
    apiType: "debit_note",
    shortName: "N. Débito"
  }, {
    id: "compra",
    nombre: "Factura de Compra",
    icono: "pi pi-shopping-cart",
    apiType: "purchase_invoice",
    shortName: "Compra"
  }];

  // Verificar si todas las configuraciones están completas
  const checkAllConfigurationsComplete = useCallback(() => {
    const requiredTypes = ["tax_invoice", "consumer", "government_invoice", "credit_note", "debit_note", "purchase_invoice"];
    const existingTypes = billings?.map(billing => billing.type) || [];
    const hasAllConfigs = requiredTypes.every(type => existingTypes.includes(type));
    console.log('🔍 Verificando configuraciones completas:', {
      requiredTypes,
      existingTypes,
      hasAllConfigs
    });
    return hasAllConfigs;
  }, [billings]);

  // Efecto para verificar configuraciones existentes
  useEffect(() => {
    const hasExistingConfigs = billings && billings.length > 0;
    const allComplete = checkAllConfigurationsComplete();
    console.log('📊 Estado de configuraciones:', {
      totalBillings: billings?.length,
      hasExistingConfigs,
      allComplete
    });
    onValidationChange?.(hasExistingConfigs);
    onConfigurationComplete?.(allComplete);
  }, [billings, checkAllConfigurationsComplete, onValidationChange, onConfigurationComplete]);

  // Cargar datos existentes
  useEffect(() => {
    if (billings.length > 0) {
      console.log('🔄 Cargando configuraciones existentes:', billings);
      billings.forEach(billing => {
        const resolutionDate = billing.resolution_date ? stringToDate(billing.resolution_date) : null;
        const expirationDate = billing.expiration_date ? stringToDate(billing.expiration_date) : null;
        const data = {
          ...billing,
          resolution_date: resolutionDate,
          expiration_date: expirationDate,
          accounting_account: +billing.accounting_account
        };

        // Marcar como guardado
        setSavedConfigs(prev => new Set(prev).add(billing.type));
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
    }
  }, [billings]);

  // Cargar cuentas contables
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
        console.error("Error cargando cuentas:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar las cuentas contables."
        });
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
  const filtrarCuentas = () => {
    return cuentasContables.sort((a, b) => (a.account_code || "").localeCompare(b.account_code || ""));
  };
  const guardarConfiguracion = async (tipo, data, errors, setValue) => {
    setLoading(prev => ({
      ...prev,
      saving: true
    }));
    try {
      const tipoConfig = tiposFacturacion.find(t => t.id === tipo);
      if (!tipoConfig) {
        throw new Error("Tipo de factura no válido");
      }
      const tipoApi = tipoConfig.apiType;

      // Format dates for API
      const formatDate = date => {
        if (!date) return null;
        if (typeof date === "string") return date;
        return date.toISOString().split("T")[0];
      };

      // Prepare payload
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

      // Add reverse account for specific invoice types
      if (["fiscal", "consumidor", "gubernamental"].includes(tipo)) {
        payload.accounting_account_reverse_id = data.accounting_account_reverse_id;
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

      // Marcar como guardado y verificar estado completo
      setSavedConfigs(prev => new Set(prev).add(tipoApi));

      // Recargar billings para verificar estado actual
      await fetchBillings();
      Swal.fire({
        icon: "success",
        title: "¡Guardado!",
        text: `Configuración de ${tipoConfig.nombre} guardada correctamente`,
        timer: 2000,
        showConfirmButton: false
      });

      // Verificar si ya puede avanzar después de guardar
      const allComplete = checkAllConfigurationsComplete();
      onConfigurationComplete?.(allComplete);
    } catch (error) {
      console.error(`Error al guardar ${tipo}:`, error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error instanceof Error ? error.message : "Error al guardar la configuración"
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
  const renderTabHeader = tipo => {
    const isSaved = savedConfigs.has(tipo.apiType);
    return /*#__PURE__*/React.createElement("span", {
      className: "d-flex align-items-center",
      style: {
        color: "#132030"
      }
    }, isMobile ? tipo.shortName : tipo.nombre, /*#__PURE__*/React.createElement("i", {
      className: `${tipo.icono} ms-1`,
      style: {
        color: "#132030",
        fontSize: isMobile ? '0.8rem' : '1rem'
      }
    }), isSaved && /*#__PURE__*/React.createElement(Badge, {
      value: "",
      className: "p-badge-success ms-1",
      style: {
        width: '8px',
        height: '8px',
        minWidth: '8px'
      }
    }));
  };
  const renderFormFields = (tipo, register, errors, setValue, watch) => {
    const cuentasFiltradas = filtrarCuentas();
    const accountingAccount = watch("accounting_account");
    const accountingAccountReverse = watch("accounting_account_reverse_id");
    const showReverseAccount = ["fiscal", "consumidor", "gubernamental"].includes(tipo);
    const tipoConfig = tiposFacturacion.find(t => t.id === tipo);
    const isSaved = tipoConfig && savedConfigs.has(tipoConfig.apiType);
    return /*#__PURE__*/React.createElement("div", {
      className: "grid p-fluid"
    }, isSaved && /*#__PURE__*/React.createElement("div", {
      className: "col-12"
    }, /*#__PURE__*/React.createElement("div", {
      className: "alert alert-success mb-3 p-2"
    }, /*#__PURE__*/React.createElement("i", {
      className: "pi pi-check-circle me-2"
    }), /*#__PURE__*/React.createElement("small", null, "Esta configuraci\xF3n ya ha sido guardada. Puedes editarla si es necesario."))), /*#__PURE__*/React.createElement("div", {
      className: "col-12 md:col-6"
    }, /*#__PURE__*/React.createElement("div", {
      className: "field mb-3"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: `dian_prefix_${tipo}`,
      className: "block text-900 font-medium mb-1"
    }, "Prefijo DGII ", /*#__PURE__*/React.createElement("span", {
      className: "text-danger"
    }, "*")), /*#__PURE__*/React.createElement(InputText, _extends({
      id: `dian_prefix_${tipo}`
    }, register("dian_prefix", {
      required: true
    }), {
      className: `w-full ${errors?.dian_prefix ? "p-invalid" : ""}`,
      placeholder: "Ej: ABC",
      size: "small"
    })), errors?.dian_prefix && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, "Favor ingrese el prefijo DGII.")), !["compra"].includes(tipo) && /*#__PURE__*/React.createElement("div", {
      className: "field mb-3"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: `accounting_account_${tipo}`,
      className: "block text-900 font-medium mb-1"
    }, "Cuenta Contable ", /*#__PURE__*/React.createElement("span", {
      className: "text-danger"
    }, "*")), /*#__PURE__*/React.createElement(Dropdown, {
      id: `accounting_account_${tipo}`,
      options: cuentasFiltradas.map(cuenta => ({
        label: `${cuenta.account_code} - ${cuenta.account_name}`,
        value: cuenta.id
      })),
      value: accountingAccount,
      onChange: e => setValue("accounting_account", e.value),
      filter: true,
      filterBy: "account_name,account_code",
      showClear: true,
      filterPlaceholder: "Buscar cuenta...",
      className: `w-full ${errors?.accounting_account ? "p-invalid" : ""}`,
      loading: loading.cuentas,
      placeholder: "Seleccione una cuenta",
      panelStyle: {
        maxWidth: isMobile ? '90vw' : 'auto'
      }
    }), errors?.accounting_account && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, "Favor seleccione una cuenta contable.")), showReverseAccount && /*#__PURE__*/React.createElement("div", {
      className: "field mb-3"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: `accounting_account_reverse_${tipo}`,
      className: "block text-900 font-medium mb-1"
    }, "Cuenta Contable Reversa ", /*#__PURE__*/React.createElement("span", {
      className: "text-danger"
    }, "*")), /*#__PURE__*/React.createElement(Dropdown, {
      id: `accounting_account_reverse_${tipo}`,
      options: cuentasFiltradas.map(cuenta => ({
        label: `${cuenta.account_code} - ${cuenta.account_name}`,
        value: cuenta.id
      })),
      value: accountingAccountReverse,
      onChange: e => setValue("accounting_account_reverse_id", e.value),
      filter: true,
      filterBy: "account_name,account_code",
      showClear: true,
      filterPlaceholder: "Buscar cuenta...",
      className: `w-full ${errors?.accounting_account_reverse_id ? "p-invalid" : ""}`,
      loading: loading.cuentas,
      placeholder: "Seleccione una cuenta",
      panelStyle: {
        maxWidth: isMobile ? '90vw' : 'auto'
      }
    }), errors?.accounting_account_reverse_id && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, "Favor seleccione una cuenta contable reversa.")), /*#__PURE__*/React.createElement("div", {
      className: "field mb-3"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: `resolution_number_${tipo}`,
      className: "block text-900 font-medium mb-1"
    }, "N\xFAmero Resoluci\xF3n ", /*#__PURE__*/React.createElement("span", {
      className: "text-danger"
    }, "*")), /*#__PURE__*/React.createElement(InputText, _extends({
      id: `resolution_number_${tipo}`
    }, register("resolution_number", {
      required: true
    }), {
      className: `w-full ${errors?.resolution_number ? "p-invalid" : ""}`,
      placeholder: "Ej: 1234567890",
      size: "small"
    })), errors?.resolution_number && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, "Favor ingrese el n\xFAmero de resoluci\xF3n."))), /*#__PURE__*/React.createElement("div", {
      className: "col-12 md:col-6"
    }, /*#__PURE__*/React.createElement("div", {
      className: "field mb-3"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: `invoice_from_${tipo}`,
      className: "block text-900 font-medium mb-1"
    }, "Facturas Desde ", /*#__PURE__*/React.createElement("span", {
      className: "text-danger"
    }, "*")), /*#__PURE__*/React.createElement(InputNumber, {
      id: `invoice_from_${tipo}`,
      value: watch("invoice_from"),
      onValueChange: e => setValue("invoice_from", e.value),
      mode: "decimal",
      useGrouping: false,
      min: 1,
      className: `w-full ${errors?.invoice_from ? "p-invalid" : ""}`,
      placeholder: "Ej: 1001",
      showButtons: true,
      buttonLayout: "horizontal"
    }), errors?.invoice_from && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, "Ingrese el n\xFAmero inicial de facturas.")), /*#__PURE__*/React.createElement("div", {
      className: "field mb-3"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: `invoice_to_${tipo}`,
      className: "block text-900 font-medium mb-1"
    }, "Facturas Hasta ", /*#__PURE__*/React.createElement("span", {
      className: "text-danger"
    }, "*")), /*#__PURE__*/React.createElement(InputNumber, {
      id: `invoice_to_${tipo}`,
      value: watch("invoice_to"),
      onValueChange: e => setValue("invoice_to", e.value),
      mode: "decimal",
      useGrouping: false,
      min: 1,
      className: `w-full ${errors?.invoice_to ? "p-invalid" : ""}`,
      placeholder: "Ej: 2000",
      showButtons: true,
      buttonLayout: "horizontal"
    }), errors?.invoice_to && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, "Ingrese el n\xFAmero final de facturas.")), /*#__PURE__*/React.createElement("div", {
      className: "field mb-3"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: `resolution_date_${tipo}`,
      className: "block text-900 font-medium mb-1"
    }, "Fecha Resoluci\xF3n ", /*#__PURE__*/React.createElement("span", {
      className: "text-danger"
    }, "*")), /*#__PURE__*/React.createElement(Calendar, {
      id: `resolution_date_${tipo}`,
      value: watch("resolution_date"),
      onChange: e => setValue("resolution_date", e.value),
      dateFormat: "dd/mm/yy",
      showIcon: true,
      placeholder: "Seleccione la fecha",
      className: `w-full ${errors?.resolution_date ? "p-invalid" : ""}`,
      readOnlyInput: true,
      icon: "pi pi-calendar"
    }), errors?.resolution_date && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, "Seleccione la fecha de resoluci\xF3n.")), /*#__PURE__*/React.createElement("div", {
      className: "field mb-3"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: `expiration_date_${tipo}`,
      className: "block text-900 font-medium mb-1"
    }, "Fecha Vencimiento ", /*#__PURE__*/React.createElement("span", {
      className: "text-danger"
    }, "*")), /*#__PURE__*/React.createElement(Calendar, {
      id: `expiration_date_${tipo}`,
      value: watch("expiration_date"),
      onChange: e => setValue("expiration_date", e.value),
      dateFormat: "dd/mm/yy",
      showIcon: true,
      placeholder: "Seleccione la fecha",
      className: `w-full ${errors?.expiration_date ? "p-invalid" : ""}`,
      readOnlyInput: true,
      icon: "pi pi-calendar"
    }), errors?.expiration_date && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, "Seleccione la fecha de vencimiento."))), /*#__PURE__*/React.createElement("div", {
      className: "col-12"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex justify-content-center mt-3"
    }, /*#__PURE__*/React.createElement(Button, {
      type: "submit",
      label: isSaved ? "Actualizar Configuración" : "Guardar Configuración",
      className: "p-button-sm w-full md:w-auto",
      loading: loading.saving,
      icon: "pi pi-save"
    }))));
  };
  const allComplete = checkAllConfigurationsComplete();
  const completedCount = tiposFacturacion.filter(tipo => savedConfigs.has(tipo.apiType)).length;
  const totalCount = tiposFacturacion.length;
  return /*#__PURE__*/React.createElement("div", {
    className: "p-2 p-md-4"
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Configuraci\xF3n de Facturaci\xF3n",
    className: "shadow-2",
    style: {
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: `alert ${allComplete ? 'alert-success' : 'alert-info'} p-2 p-md-3`
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center mb-2 mb-md-0"
  }, /*#__PURE__*/React.createElement("i", {
    className: `${allComplete ? 'pi pi-check-circle' : 'pi pi-info-circle'} me-2`
  }), /*#__PURE__*/React.createElement("span", {
    className: "small"
  }, allComplete ? "✅ Todas las configuraciones están completas. Puedes avanzar al siguiente módulo." : `ℹ️ Completa todas las configuraciones de facturación (${completedCount}/${totalCount})`)), /*#__PURE__*/React.createElement(Badge, {
    value: `${completedCount}/${totalCount}`,
    severity: allComplete ? "success" : "info",
    className: "ms-md-2"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "billing-tabs-responsive"
  }, /*#__PURE__*/React.createElement(TabView, {
    activeIndex: activeTab,
    onTabChange: e => setActiveTab(e.index),
    className: "w-full",
    scrollable: true
  }, tiposFacturacion.map(tipo => /*#__PURE__*/React.createElement(TabPanel, {
    key: tipo.id,
    header: renderTabHeader(tipo),
    headerClassName: "p-tab-header-responsive"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tab-content-responsive p-2 p-md-3"
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: tipo.id === "fiscal" ? handleFiscal(onSubmitFiscal) : tipo.id === "consumidor" ? handleConsumidor(onSubmitConsumidor) : tipo.id === "gubernamental" ? handleGubernamental(onSubmitGubernamental) : tipo.id === "notaCredito" ? handleNotaCredito(onSubmitNotaCredito) : tipo.id === "notaDebito" ? handleNotaDebito(onSubmitNotaDebito) : handleCompra(onSubmitCompra),
    className: "w-full"
  }, renderFormFields(tipo.id, tipo.id === "fiscal" ? registerFiscal : tipo.id === "consumidor" ? registerConsumidor : tipo.id === "gubernamental" ? registerGubernamental : tipo.id === "notaCredito" ? registerNotaCredito : tipo.id === "notaDebito" ? registerNotaDebito : registerCompra, tipo.id === "fiscal" ? errorsFiscal : tipo.id === "consumidor" ? errorsConsumidor : tipo.id === "gubernamental" ? errorsGubernamental : tipo.id === "notaCredito" ? errorsNotaCredito : tipo.id === "notaDebito" ? errorsNotaDebito : errorsCompra, tipo.id === "fiscal" ? setValueFiscal : tipo.id === "consumidor" ? setValueConsumidor : tipo.id === "gubernamental" ? setValueGubernamental : tipo.id === "notaCredito" ? setValueNotaCredito : tipo.id === "notaDebito" ? setValueNotaDebito : setValueCompra, tipo.id === "fiscal" ? watchFiscal : tipo.id === "consumidor" ? watchConsumidor : tipo.id === "gubernamental" ? watchGubernamental : tipo.id === "notaCredito" ? watchNotaCredito : tipo.id === "notaDebito" ? watchNotaDebito : watchCompra))))))), isMobile && /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between mt-3"
  }, /*#__PURE__*/React.createElement(Button, {
    icon: "pi pi-chevron-left",
    className: "p-button-text p-button-sm",
    disabled: activeTab === 0,
    onClick: () => setActiveTab(prev => prev - 1),
    tooltip: "Tab anterior"
  }), /*#__PURE__*/React.createElement("small", {
    className: "text-muted align-self-center"
  }, activeTab + 1, " de ", tiposFacturacion.length), /*#__PURE__*/React.createElement(Button, {
    icon: "pi pi-chevron-right",
    className: "p-button-text p-button-sm",
    disabled: activeTab === tiposFacturacion.length - 1,
    onClick: () => setActiveTab(prev => prev + 1),
    tooltip: "Siguiente tab"
  }))), /*#__PURE__*/React.createElement("style", null, `
        .billing-tabs-responsive .p-tabview-nav {
          flex-wrap: wrap;
          overflow-x: auto;
        }
        
        .billing-tabs-responsive .p-tabview-nav-link {
          padding: 0.5rem 0.75rem;
          font-size: 0.8rem;
          white-space: nowrap;
        }
        
        .p-tab-header-responsive {
          min-width: auto;
        }
        
        .tab-content-responsive {
          max-height: 60vh;
          overflow-y: auto;
        }
        
        /* Mejoras para móviles */
        @media (max-width: 767px) {
          .p-tabview-nav {
            font-size: 0.75rem;
          }
          
          .p-tabview-nav-link {
            padding: 0.4rem 0.6rem !important;
          }
          
          .p-calendar .p-inputtext {
            font-size: 0.8rem;
          }
          
          .p-dropdown .p-dropdown-label {
            font-size: 0.8rem;
          }
          
          .field {
            margin-bottom: 1rem;
          }
        }
        
        /* Mejoras para tablets */
        @media (min-width: 768px) and (max-width: 1024px) {
          .p-tabview-nav-link {
            padding: 0.6rem 0.8rem;
            font-size: 0.85rem;
          }
        }
        
        /* Scroll suave para el contenido de tabs */
        .tab-content-responsive::-webkit-scrollbar {
          width: 6px;
        }
        
        .tab-content-responsive::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        
        .tab-content-responsive::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }
        
        .tab-content-responsive::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `));
};
export default BillingConfigTab;