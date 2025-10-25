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
import {
  ConfigFactura,
  CuentaContable,
} from "./interfaces/BillingConfigTabTypes";
import { useBillings } from "../../billing/hooks/useBillings";
import { stringToDate } from "../../../services/utilidades";
import { billingService } from "../../../services/api";

interface BillingConfigTabProps {
  onValidationChange?: (isValid: boolean) => void;
  onConfigurationComplete?: (isComplete: boolean) => void;
}

const BillingConfigTab: React.FC<BillingConfigTabProps> = ({
  onValidationChange,
  onConfigurationComplete,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [cuentasContables, setCuentasContables] = useState<CuentaContable[]>(
    []
  );
  const [savedConfigs, setSavedConfigs] = useState<Set<string>>(new Set());
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState({
    cuentas: false,
    saving: false,
  });

  // Detectar tamaño de pantalla
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const {
    register: registerFiscal,
    handleSubmit: handleFiscal,
    reset: resetFiscal,
    setValue: setValueFiscal,
    watch: watchFiscal,
    formState: { errors: errorsFiscal },
  } = useForm<ConfigFactura>();

  const { fetchBillings, billings } = useBillings();

  const {
    register: registerConsumidor,
    handleSubmit: handleConsumidor,
    reset: resetConsumidor,
    setValue: setValueConsumidor,
    watch: watchConsumidor,
    formState: { errors: errorsConsumidor },
  } = useForm<ConfigFactura>();

  const {
    register: registerGubernamental,
    handleSubmit: handleGubernamental,
    reset: resetGubernamental,
    setValue: setValueGubernamental,
    watch: watchGubernamental,
    formState: { errors: errorsGubernamental },
  } = useForm<ConfigFactura>();

  const {
    register: registerNotaCredito,
    handleSubmit: handleNotaCredito,
    reset: resetNotaCredito,
    setValue: setValueNotaCredito,
    watch: watchNotaCredito,
    formState: { errors: errorsNotaCredito },
  } = useForm<ConfigFactura>();

  const {
    register: registerNotaDebito,
    handleSubmit: handleNotaDebito,
    reset: resetNotaDebito,
    setValue: setValueNotaDebito,
    watch: watchNotaDebito,
    formState: { errors: errorsNotaDebito },
  } = useForm<ConfigFactura>();

  const {
    register: registerCompra,
    handleSubmit: handleCompra,
    reset: resetCompra,
    setValue: setValueCompra,
    watch: watchCompra,
    formState: { errors: errorsCompra },
  } = useForm<ConfigFactura>();

  const tiposFacturacion = [
    {
      id: "fiscal",
      nombre: "Factura Fiscal",
      icono: "fa-solid fa-file-invoice-dollar",
      apiType: "tax_invoice",
      shortName: "Fiscal",
    },
    {
      id: "consumidor",
      nombre: "Factura Consumidor",
      icono: "fa-solid fa-receipt",
      apiType: "consumer",
      shortName: "Consumidor",
    },
    {
      id: "gubernamental",
      nombre: "Factura Gubernamental",
      icono: "fa-solid fa-building-user",
      apiType: "government_invoice",
      shortName: "Gubernamental",
    },
    {
      id: "notaCredito",
      nombre: "Notas de Crédito",
      icono: "fa-solid fa-pen-nib",
      apiType: "credit_note",
      shortName: "N. Crédito",
    },
    {
      id: "notaDebito",
      nombre: "Notas de Débito",
      icono: "fa-solid fa-credit-card",
      apiType: "debit_note",
      shortName: "N. Débito",
    },
    {
      id: "compra",
      nombre: "Factura de Compra",
      icono: "fa-solid fa-cedi-sign",
      apiType: "purchase_invoice",
      shortName: "Compra",
    },
  ];

  // Verificar si todas las configuraciones están completas
  const checkAllConfigurationsComplete = useCallback(() => {
    const requiredTypes = [
      "tax_invoice",
      "consumer",
      "government_invoice",
      "credit_note",
      "debit_note",
      "purchase_invoice",
    ];

    const existingTypes = billings?.map((billing) => billing.type) || [];
    const hasAllConfigs = requiredTypes.every((type) =>
      existingTypes.includes(type)
    );

    console.log("🔍 Verificando configuraciones completas:", {
      requiredTypes,
      existingTypes,
      hasAllConfigs,
    });

    return hasAllConfigs;
  }, [billings]);

  // Efecto para verificar configuraciones existentes
  useEffect(() => {
    const hasExistingConfigs = billings && billings.length > 0;
    const allComplete = checkAllConfigurationsComplete();

    console.log("📊 Estado de configuraciones:", {
      totalBillings: billings?.length,
      hasExistingConfigs,
      allComplete,
    });

    onValidationChange?.(hasExistingConfigs);
    onConfigurationComplete?.(allComplete);
  }, [
    billings,
    checkAllConfigurationsComplete,
    onValidationChange,
    onConfigurationComplete,
  ]);

  // Cargar datos existentes
  useEffect(() => {
    if (billings.length > 0) {
      console.log("🔄 Cargando configuraciones existentes:", billings);

      billings.forEach((billing) => {
        const resolutionDate = billing.resolution_date
          ? stringToDate(billing.resolution_date)
          : null;
        const expirationDate = billing.expiration_date
          ? stringToDate(billing.expiration_date)
          : null;
        const data = {
          ...billing,
          resolution_date: resolutionDate,
          expiration_date: expirationDate,
          accounting_account: +billing.accounting_account,
        };

        // Marcar como guardado
        setSavedConfigs((prev) => new Set(prev).add(billing.type));

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
      setLoading((prev) => ({ ...prev, cuentas: true }));
      try {
        const response = await fetch(
          "/api/v1/admin/accounting-accounts?per_page=all"
        );

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        const cuentas = Array.isArray(data)
          ? data
          : data.data || data.accounts || [];

        setCuentasContables(
          cuentas.filter((cuenta: CuentaContable) => cuenta.status === "active")
        );
      } catch (error) {
        console.error("Error cargando cuentas:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar las cuentas contables.",
        });
      } finally {
        setLoading((prev) => ({ ...prev, cuentas: false }));
      }
    };

    cargarCuentasContables();
    fetchBillings();
  }, []);

  const filtrarCuentas = () => {
    return cuentasContables.sort((a: CuentaContable, b: CuentaContable) =>
      (a.account_code || "").localeCompare(b.account_code || "")
    );
  };

  const guardarConfiguracion = async (
    tipo: string,
    data: ConfigFactura,
    errors: any,
    setValue: any
  ) => {
    setLoading((prev) => ({ ...prev, saving: true }));

    try {
      const tipoConfig = tiposFacturacion.find((t) => t.id === tipo);
      if (!tipoConfig) {
        throw new Error("Tipo de factura no válido");
      }

      const tipoApi = tipoConfig.apiType;

      const formatDate = (date: Date | string | null): string | null => {
        if (!date) return null;
        if (typeof date === "string") return date;
        return date.toISOString().split("T")[0];
      };

      const payload: any = {
        dian_prefix: data.dian_prefix,
        accounting_account: data.accounting_account?.toString(),
        resolution_number: data.resolution_number,
        invoice_from: data.invoice_from,
        invoice_to: data.invoice_to,
        resolution_date: formatDate(data.resolution_date),
        expiration_date: formatDate(data.expiration_date),
        type: tipoApi,
      };

      if (["fiscal", "consumidor", "gubernamental"].includes(tipo)) {
        payload.accounting_account_reverse_id =
          data.accounting_account_reverse_id;
      }

      await billingService.saveBillingConfiguration(payload);

      setSavedConfigs((prev) => new Set(prev).add(tipoApi));

      await fetchBillings();

      Swal.fire({
        icon: "success",
        title: "¡Guardado!",
        text: `Configuración de ${tipoConfig.nombre} guardada correctamente`,
        timer: 2000,
        showConfirmButton: false,
      });

      const allComplete = checkAllConfigurationsComplete();
      onConfigurationComplete?.(allComplete);
    } catch (error) {
      console.error(`Error al guardar ${tipo}:`, error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error al guardar la configuración";

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });
    } finally {
      setLoading((prev) => ({ ...prev, saving: false }));
    }
  };

  const onSubmitFiscal = (data: ConfigFactura) =>
    guardarConfiguracion("fiscal", data, errorsFiscal, setValueFiscal);
  const onSubmitConsumidor = (data: ConfigFactura) =>
    guardarConfiguracion(
      "consumidor",
      data,
      errorsConsumidor,
      setValueConsumidor
    );
  const onSubmitGubernamental = (data: ConfigFactura) =>
    guardarConfiguracion(
      "gubernamental",
      data,
      errorsGubernamental,
      setValueGubernamental
    );
  const onSubmitNotaCredito = (data: ConfigFactura) =>
    guardarConfiguracion(
      "notaCredito",
      data,
      errorsNotaCredito,
      setValueNotaCredito
    );
  const onSubmitNotaDebito = (data: ConfigFactura) =>
    guardarConfiguracion(
      "notaDebito",
      data,
      errorsNotaDebito,
      setValueNotaDebito
    );
  const onSubmitCompra = (data: ConfigFactura) =>
    guardarConfiguracion("compra", data, errorsCompra, setValueCompra);

  const renderTabHeader = (tipo: any) => {
    const isSaved = savedConfigs.has(tipo.apiType);

    return (
      <span className="d-flex align-items-center" style={{ color: "#132030" }}>
        {isMobile ? tipo.shortName : tipo.nombre}
        <i
          className={`${tipo.icono} ms-1`}
          style={{ color: "#132030", fontSize: isMobile ? "0.8rem" : "1rem" }}
        ></i>
        {isSaved && (
          <Badge
            value=""
            className="p-badge-success ms-1"
            style={{ width: "8px", height: "8px", minWidth: "8px" }}
          />
        )}
      </span>
    );
  };

  const renderFormFields = (
    tipo: string,
    register: any,
    errors: any,
    setValue: any,
    watch: any
  ) => {
    const cuentasFiltradas = filtrarCuentas();
    const accountingAccount = watch("accounting_account");
    const accountingAccountReverse = watch("accounting_account_reverse_id");
    const showReverseAccount = [
      "fiscal",
      "consumidor",
      "gubernamental",
      "notaCredito",
      "notaDebito",
      "compra",
    ].includes(tipo);

    const tipoConfig = tiposFacturacion.find((t) => t.id === tipo);
    const isSaved = tipoConfig && savedConfigs.has(tipoConfig.apiType);

    return (
      <form
        onSubmit={
          tipo === "fiscal"
            ? handleFiscal(onSubmitFiscal)
            : tipo === "consumidor"
            ? handleConsumidor(onSubmitConsumidor)
            : tipo === "gubernamental"
            ? handleGubernamental(onSubmitGubernamental)
            : tipo === "notaCredito"
            ? handleNotaCredito(onSubmitNotaCredito)
            : tipo === "notaDebito"
            ? handleNotaDebito(onSubmitNotaDebito)
            : handleCompra(onSubmitCompra)
        }
        className="p-fluid"
      >
        <div className="row">
          {/* Columna Izquierda */}
          <div className="col-md-6">
            <div className="field mb-4">
              <label
                htmlFor={`dian_prefix_${tipo}`}
                className="font-medium block mb-2"
              >
                Prefijo DGII <span className="text-danger">*</span>
              </label>
              <InputText
                id={`dian_prefix_${tipo}`}
                {...register("dian_prefix", { required: true })}
                className={`w-full ${errors?.dian_prefix ? "p-invalid" : ""}`}
                placeholder="Ej: ABC"
              />
              {errors?.dian_prefix && (
                <small className="p-error">
                  Favor ingrese el prefijo DGII.
                </small>
              )}
            </div>

            {/* {!["compra"].includes(tipo) && (
              <div className="field mb-4">
                <label htmlFor={`accounting_account_${tipo}`} className="font-medium block mb-2">
                  Cuenta Contable <span className="text-danger">*</span>
                </label>
                <Dropdown
                  id={`accounting_account_${tipo}`}
                  options={cuentasFiltradas.map((cuenta: CuentaContable) => ({
                    label: `${cuenta.account_code} - ${cuenta.account_name}`,
                    value: cuenta.id,
                    account_code: cuenta.account_code,
                    account_name: cuenta.account_name

                  }))}
                  value={accountingAccount}
                  onChange={(e) => setValue("accounting_account", e.value)}
                  filter
                  filterBy="account_name,account_code,label"
                  showClear
                  filterPlaceholder="Buscar cuenta..."
                  className={`w-full ${errors?.accounting_account ? "p-invalid" : ""}`}
                  loading={loading.cuentas}
                  placeholder="Seleccione una cuenta"
                  appendTo="self"
                />
                {errors?.accounting_account && (
                  <small className="p-error">Favor seleccione una cuenta contable.</small>
                )}
              </div>
            )} */}

            <div className="field mb-4">
              <label
                htmlFor={`accounting_account_${tipo}`}
                className="font-medium block mb-2"
              >
                Cuenta Contable <span className="text-danger">*</span>
              </label>
              <Dropdown
                id={`accounting_account_${tipo}`}
                options={cuentasFiltradas.map((cuenta: CuentaContable) => ({
                  label: `${cuenta.account_code} - ${cuenta.account_name}`,
                  value: cuenta.id,
                  account_code: cuenta.account_code,
                  account_name: cuenta.account_name,
                }))}
                value={accountingAccount}
                onChange={(e) => setValue("accounting_account", e.value)}
                filter
                filterBy="account_name,account_code,label"
                showClear
                filterPlaceholder="Buscar cuenta..."
                className={`w-full ${
                  errors?.accounting_account ? "p-invalid" : ""
                }`}
                loading={loading.cuentas}
                placeholder="Seleccione una cuenta"
                appendTo="self"
              />
              {errors?.accounting_account && (
                <small className="p-error">
                  Favor seleccione una cuenta contable.
                </small>
              )}
            </div>

            {showReverseAccount && (
              <div className="field mb-4">
                <label
                  htmlFor={`accounting_account_reverse_${tipo}`}
                  className="font-medium block mb-2"
                >
                  Cuenta Contable Reversa <span className="text-danger">*</span>
                </label>
                <Dropdown
                  id={`accounting_account_reverse_${tipo}`}
                  options={cuentasFiltradas.map((cuenta: CuentaContable) => ({
                    label: `${cuenta.account_code} - ${cuenta.account_name}`,
                    value: cuenta.id,
                    account_code: cuenta.account_code,
                    account_name: cuenta.account_name,
                  }))}
                  value={accountingAccountReverse}
                  onChange={(e) =>
                    setValue("accounting_account_reverse_id", e.value)
                  }
                  filter
                  filterBy="account_name,account_code,label"
                  showClear
                  filterPlaceholder="Buscar cuenta..."
                  className={`w-full ${
                    errors?.accounting_account_reverse_id ? "p-invalid" : ""
                  }`}
                  loading={loading.cuentas}
                  placeholder="Seleccione una cuenta"
                  appendTo="self"
                />
                {errors?.accounting_account_reverse_id && (
                  <small className="p-error">
                    Favor seleccione una cuenta contable reversa.
                  </small>
                )}
              </div>
            )}

            <div className="field mb-4">
              <label
                htmlFor={`resolution_number_${tipo}`}
                className="font-medium block mb-2"
              >
                Número Resolución <span className="text-danger">*</span>
              </label>
              <InputText
                id={`resolution_number_${tipo}`}
                {...register("resolution_number", { required: true })}
                className={`w-full ${
                  errors?.resolution_number ? "p-invalid" : ""
                }`}
                placeholder="Ej: 1234567890"
              />
              {errors?.resolution_number && (
                <small className="p-error">
                  Favor ingrese el número de resolución.
                </small>
              )}
            </div>
          </div>

          {/* Columna Derecha */}
          <div className="col-md-6">
            <div className="field mb-4">
              <label
                htmlFor={`invoice_from_${tipo}`}
                className="font-medium block mb-2"
              >
                Facturas Desde <span className="text-danger">*</span>
              </label>
              <InputNumber
                id={`invoice_from_${tipo}`}
                value={watch("invoice_from")}
                onValueChange={(e) => setValue("invoice_from", e.value)}
                mode="decimal"
                useGrouping={false}
                min={1}
                className={`w-full ${errors?.invoice_from ? "p-invalid" : ""}`}
                placeholder="Ej: 1001"
                showButtons
                buttonLayout="horizontal"
              />
              {errors?.invoice_from && (
                <small className="p-error">
                  Ingrese el número inicial de facturas.
                </small>
              )}
            </div>

            <div className="field mb-4">
              <label
                htmlFor={`invoice_to_${tipo}`}
                className="font-medium block mb-2"
              >
                Facturas Hasta <span className="text-danger">*</span>
              </label>
              <InputNumber
                id={`invoice_to_${tipo}`}
                value={watch("invoice_to")}
                onValueChange={(e) => setValue("invoice_to", e.value)}
                mode="decimal"
                useGrouping={false}
                min={1}
                className={`w-full ${errors?.invoice_to ? "p-invalid" : ""}`}
                placeholder="Ej: 2000"
                showButtons
                buttonLayout="horizontal"
              />
              {errors?.invoice_to && (
                <small className="p-error">
                  Ingrese el número final de facturas.
                </small>
              )}
            </div>

            <div className="field mb-4">
              <label
                htmlFor={`resolution_date_${tipo}`}
                className="font-medium block mb-2"
              >
                Fecha Resolución <span className="text-danger">*</span>
              </label>
              <Calendar
                id={`resolution_date_${tipo}`}
                value={watch("resolution_date")}
                onChange={(e) => setValue("resolution_date", e.value)}
                dateFormat="dd/mm/yy"
                showIcon
                placeholder="Seleccione la fecha"
                className={`w-full ${
                  errors?.resolution_date ? "p-invalid" : ""
                }`}
                readOnlyInput
                icon={<i className="fa fa-calendar"></i>}
                appendTo="self"
              />
              {errors?.resolution_date && (
                <small className="p-error">
                  Seleccione la fecha de resolución.
                </small>
              )}
            </div>

            <div className="field mb-4">
              <label
                htmlFor={`expiration_date_${tipo}`}
                className="font-medium block mb-2"
              >
                Fecha Vencimiento <span className="text-danger">*</span>
              </label>
              <Calendar
                id={`expiration_date_${tipo}`}
                value={watch("expiration_date")}
                onChange={(e) => setValue("expiration_date", e.value)}
                dateFormat="dd/mm/yy"
                showIcon
                placeholder="Seleccione la fecha"
                className={`w-full ${
                  errors?.expiration_date ? "p-invalid" : ""
                }`}
                readOnlyInput
                icon={<i className="fa fa-calendar"></i>}
                appendTo="self"
              />
              {errors?.expiration_date && (
                <small className="p-error">
                  Seleccione la fecha de vencimiento.
                </small>
              )}
            </div>
          </div>
        </div>

        {/* Botón de Guardado - Ocupa toda la fila */}
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-center mt-4">
              <Button
                type="submit"
                label={
                  isSaved ? "Actualizar Configuración" : "Guardar Configuración"
                }
                className="p-button-sm"
                loading={loading.saving}
                icon="pi pi-save"
                style={{ padding: "0 40px", width: "250px", height: "45px" }}
              />
            </div>
          </div>
        </div>
      </form>
    );
  };

  return (
    <div className="p-2 p-md-4">
      <Card title="Configuración de Facturación" className="shadow-2">
        {/* Tabs Responsive */}
        <div className="billing-tabs-responsive">
          <TabView
            activeIndex={activeTab}
            onTabChange={(e) => setActiveTab(e.index)}
            className="w-full"
            scrollable
          >
            {tiposFacturacion.map((tipo) => (
              <TabPanel
                key={tipo.id}
                header={renderTabHeader(tipo)}
                headerClassName="p-tab-header-responsive"
              >
                <div className="tab-content-responsive p-2 p-md-3">
                  {renderFormFields(
                    tipo.id,
                    tipo.id === "fiscal"
                      ? registerFiscal
                      : tipo.id === "consumidor"
                      ? registerConsumidor
                      : tipo.id === "gubernamental"
                      ? registerGubernamental
                      : tipo.id === "notaCredito"
                      ? registerNotaCredito
                      : tipo.id === "notaDebito"
                      ? registerNotaDebito
                      : registerCompra,
                    tipo.id === "fiscal"
                      ? errorsFiscal
                      : tipo.id === "consumidor"
                      ? errorsConsumidor
                      : tipo.id === "gubernamental"
                      ? errorsGubernamental
                      : tipo.id === "notaCredito"
                      ? errorsNotaCredito
                      : tipo.id === "notaDebito"
                      ? errorsNotaDebito
                      : errorsCompra,
                    tipo.id === "fiscal"
                      ? setValueFiscal
                      : tipo.id === "consumidor"
                      ? setValueConsumidor
                      : tipo.id === "gubernamental"
                      ? setValueGubernamental
                      : tipo.id === "notaCredito"
                      ? setValueNotaCredito
                      : tipo.id === "notaDebito"
                      ? setValueNotaDebito
                      : setValueCompra,
                    tipo.id === "fiscal"
                      ? watchFiscal
                      : tipo.id === "consumidor"
                      ? watchConsumidor
                      : tipo.id === "gubernamental"
                      ? watchGubernamental
                      : tipo.id === "notaCredito"
                      ? watchNotaCredito
                      : tipo.id === "notaDebito"
                      ? watchNotaDebito
                      : watchCompra
                  )}
                </div>
              </TabPanel>
            ))}
          </TabView>
        </div>

        {/* Navegación entre tabs en móvil */}
        {isMobile && (
          <div className="d-flex justify-content-between mt-3">
            <Button
              icon="pi pi-chevron-left"
              className="p-button-text p-button-sm"
              disabled={activeTab === 0}
              onClick={() => setActiveTab((prev) => prev - 1)}
              tooltip="Tab anterior"
            />
            <small className="text-muted align-self-center">
              {activeTab + 1} de {tiposFacturacion.length}
            </small>
            <Button
              icon="pi pi-chevron-right"
              className="p-button-text p-button-sm"
              disabled={activeTab === tiposFacturacion.length - 1}
              onClick={() => setActiveTab((prev) => prev + 1)}
              tooltip="Siguiente tab"
            />
          </div>
        )}
      </Card>

      <style>{`
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
          max-height: 100vh;
        }
        
        .field {
          margin-bottom: 1.5rem;
        }
        
        .p-inputtext, .p-dropdown, .p-calendar, .p-inputnumber {
          width: 100% !important;
        }
        
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
      `}</style>
    </div>
  );
};

export default BillingConfigTab;
