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
import { ConfigFactura, CuentaContable } from "./interfaces/BillingConfigTabTypes";
import { useBillings } from "../../billing/hooks/useBillings";
import { stringToDate } from "../../../services/utilidades";


const BillingConfigTab = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [cuentasContables, setCuentasContables] = useState<CuentaContable[]>(
    []
  );
  const [loading, setLoading] = useState({
    cuentas: false,
    saving: false,
  });

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
    },
    { id: "consumidor", nombre: "Factura Consumidor", icono: "pi pi-receipt" },
    {
      id: "gubernamental",
      nombre: "Factura Gubernamental",
      icono: "pi pi-building",
    },
    { id: "notaCredito", nombre: "Notas de Crédito", icono: "pi pi-file-edit" },
    { id: "notaDebito", nombre: "Notas de Débito", icono: "pi pi-file-edit" },
    { id: "compra", nombre: "Factura de Compra", icono: "pi pi-shopping-cart" },
  ];

  const handleFetchError = (error: unknown, message: string) => {
    console.error(message, error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: message,
    });
    return null;
  };

  // Load accounting accounts
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
        handleFetchError(
          error,
          "No se pudieron cargar las cuentas contables. Por favor, intente nuevamente."
        );
      } finally {
        setLoading((prev) => ({ ...prev, cuentas: false }));
      }
    };

    cargarCuentasContables();
    fetchBillings();
  }, []);

  useEffect(() => {
    billings.forEach((billing) => {

      const resolutionDate = billing.resolution_date ? stringToDate(billing.resolution_date) : null;
      const expirationDate = billing.expiration_date ? stringToDate(billing.expiration_date) : null;
      const data = {
        ...billing,
        resolution_date: resolutionDate,
        expiration_date: expirationDate,
        accounting_account: +billing.accounting_account
      }

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
    })
  }, [billings]);

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
        compra: "purchase_invoice",
      }[tipo as keyof typeof tiposFacturacion];

      if (!tipoApi) {
        throw new Error("Tipo de factura no válido");
      }

      // Format dates for API
      const formatDate = (date: Date | string | null): string | null => {
        if (!date) return null;
        if (typeof date === "string") return date;

        const d = new Date(date);
        return d.toISOString().split("T")[0];
      };

      // Prepare payload based on invoice type
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

      // Add reverse account for specific invoice types
      if (["fiscal", "consumidor", "gubernamental"].includes(tipo)) {
        payload.accounting_account_reverse_id =
          data.accounting_account_reverse_id;
      }

      const url = "/medical/companies/1/billings";

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error HTTP: ${response.status}`);
      }

      const result = await response.json();

      Swal.fire({
        icon: "success",
        title: "¡Guardado!",
        text: `Configuración de ${tiposFacturacion.find((t) => t.id === tipo)?.nombre
          } guardada correctamente`,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(`Error al guardar ${tipo}:`, error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error instanceof Error
            ? error.message
            : `Error al guardar la configuración`,
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
    guardarConfiguracion(
      "compra",
      data,
      errorsCompra,
      setValueCompra
    );

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
    ].includes(tipo);

    return (
      <div className="grid p-fluid">
        <div className="col-12 md:col-6">
          <div className="field mb-4">
            <label
              htmlFor={`dian_prefix_${tipo}`}
              className="block text-900 font-medium mb-2"
            >
              Prefijo DGII
            </label>
            <InputText
              id={`dian_prefix_${tipo}`}
              {...register("dian_prefix", { required: true })}
              className={`w-full ${errors?.dian_prefix ? "p-invalid" : ""}`}
              placeholder="Ej: ABC"
            />
            {errors?.dian_prefix && (
              <small className="p-error">Favor ingrese el prefijo DGII.</small>
            )}
          </div>

          {![
            "compra",
          ].includes(tipo) && (<div className="field mb-4">
            <label
              htmlFor={`accounting_account_${tipo}`}
              className="block text-900 font-medium mb-2"
            >
              Cuenta Contable
            </label>
            <Dropdown
              id={`accounting_account_${tipo}`}
              options={cuentasFiltradas.map((cuenta: CuentaContable) => ({
                label: `${cuenta.account_code} - ${cuenta.account_name}`,
                value: cuenta.id,
              }))}
              value={accountingAccount}
              onChange={(e) => setValue("accounting_account", e.value)}
              filter
              filterBy="account_name,account_code"
              showClear
              filterPlaceholder="Buscar cuenta..."
              className={`w-full ${errors?.accounting_account ? "p-invalid" : ""
                }`}
              loading={loading.cuentas}
              placeholder="Seleccione una cuenta"
            />
            {errors?.accounting_account && (
              <small className="p-error">
                Favor seleccione una cuenta contable.
              </small>
            )}
          </div>
            )}

          {/* Reverse Account Field (only for fiscal, consumer, and government invoices) */}
          {showReverseAccount && (
            <div className="field mb-4">
              <label
                htmlFor={`accounting_account_reverse_${tipo}`}
                className="block text-900 font-medium mb-2"
              >
                Cuenta Contable Reversa
              </label>
              <Dropdown
                id={`accounting_account_reverse_${tipo}`}
                options={cuentasFiltradas.map((cuenta: CuentaContable) => ({
                  label: `${cuenta.account_code} - ${cuenta.account_name}`,
                  value: cuenta.id,
                }))}
                value={accountingAccountReverse}
                onChange={(e) =>
                  setValue("accounting_account_reverse_id", e.value)
                }
                filter
                filterBy="account_name,account_code"
                showClear
                filterPlaceholder="Buscar cuenta..."
                className={`w-full ${errors?.accounting_account_reverse_id ? "p-invalid" : ""
                  }`}
                loading={loading.cuentas}
                placeholder="Seleccione una cuenta"
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
              className="block text-900 font-medium mb-2"
            >
              Número Resolución
            </label>
            <InputText
              id={`resolution_number_${tipo}`}
              {...register("resolution_number", { required: true })}
              className={`w-full ${errors?.resolution_number ? "p-invalid" : ""
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

        <div className="col-12 md:col-6">
          <div className="field mb-4">
            <label
              htmlFor={`invoice_from_${tipo}`}
              className="block text-900 font-medium mb-2"
            >
              Facturas Desde
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
              className="block text-900 font-medium mb-2"
            >
              Facturas Hasta
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
              className="block text-900 font-medium mb-2"
            >
              Fecha Resolución
            </label>
            <Calendar
              id={`resolution_date_${tipo}`}
              value={watch("resolution_date")}
              onChange={(e) => setValue("resolution_date", e.value)}
              dateFormat="dd/mm/yy"
              showIcon
              placeholder="Seleccione la fecha de resolución"
              className={`w-full ${errors?.resolution_date ? "p-invalid" : ""}`}
              readOnlyInput
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
              className="block text-900 font-medium mb-2"
            >
              Fecha Vencimiento
            </label>
            <Calendar
              id={`expiration_date_${tipo}`}
              value={watch("expiration_date")}
              onChange={(e) => setValue("expiration_date", e.value)}
              dateFormat="dd/mm/yy"
              showIcon
              placeholder="Seleccione la fecha de vencimiento"
              className={`w-full ${errors?.expiration_date ? "p-invalid" : ""}`}
              readOnlyInput
            />
            {errors?.expiration_date && (
              <small className="p-error">
                Seleccione la fecha de vencimiento.
              </small>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="col-12" style={{ display: "flex", justifyContent: "center" }}>
          <div className="flex justify-content-center mt-4">
            <Button
              type="submit"
              label="Guardar Configuración"
              className="p-button-sm md:p-button mx-auto"
              style={{ width: "100%" }}
              loading={loading.saving}
            >
              <i className="fas fa-save ms-2"></i>
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4">
      <Card title="Configuración de Facturación" className="shadow-3">
        <TabView
          activeIndex={activeTab}
          onTabChange={(e) => setActiveTab(e.index)}
          className="w-full"
        >
          {/* Factura Fiscal */}
          <TabPanel
            header={
              <span
                className="d-flex align-items-center"
                style={{ color: "#132030" }}
              >
                Factura Fiscal
                <i
                  className="fas fa-file-invoice-dollar ms-1"
                  style={{ color: "#132030" }}
                ></i>
              </span>
            }
          >
            <form onSubmit={handleFiscal(onSubmitFiscal)} className="w-full">
              {renderFormFields(
                "fiscal",
                registerFiscal,
                errorsFiscal,
                setValueFiscal,
                watchFiscal
              )}
            </form>
          </TabPanel>

          {/* Factura Consumidor */}
          <TabPanel
            header={
              <span
                className="d-flex align-items-center"
                style={{ color: "#132030" }}
              >
                Factura Consumidor
                <i
                  className="fa-solid fa-file-invoice ms-1"
                  style={{ color: "#132030" }}
                ></i>
              </span>
            }
          >
            <form
              onSubmit={handleConsumidor(onSubmitConsumidor)}
              className="w-full"
            >
              {renderFormFields(
                "consumidor",
                registerConsumidor,
                errorsConsumidor,
                setValueConsumidor,
                watchConsumidor
              )}
            </form>
          </TabPanel>

          {/* Factura Gubernamental */}
          <TabPanel
            header={
              <span
                className="d-flex align-items-center"
                style={{ color: "#132030" }}
              >
                Factura Gubernamental
                <i
                  className="fa-solid fa-building-columns ms-1"
                  style={{ color: "#132030" }}
                ></i>
              </span>
            }
          >
            <form
              onSubmit={handleGubernamental(onSubmitGubernamental)}
              className="w-full"
            >
              {renderFormFields(
                "gubernamental",
                registerGubernamental,
                errorsGubernamental,
                setValueGubernamental,
                watchGubernamental
              )}
            </form>
          </TabPanel>

          {/* Notas de Crédito */}
          <TabPanel
            header={
              <span
                className="d-flex align-items-center"
                style={{ color: "#132030" }}
              >
                Notas de Crédito
                <i
                  className="fa-solid fa-money-bill-transfer ms-1"
                  style={{ color: "#132030" }}
                ></i>
              </span>
            }
          >
            <form
              onSubmit={handleNotaCredito(onSubmitNotaCredito)}
              className="w-full"
            >
              {renderFormFields(
                "notaCredito",
                registerNotaCredito,
                errorsNotaCredito,
                setValueNotaCredito,
                watchNotaCredito
              )}
            </form>
          </TabPanel>

          {/* Notas de Débito */}
          <TabPanel
            header={
              <span
                className="d-flex align-items-center"
                style={{ color: "#132030" }}
              >
                Notas de Débito
                <i
                  className="fa-solid fa-money-bill-trend-up ms-1"
                  style={{ color: "#132030" }}
                ></i>
              </span>
            }
          >
            <form
              onSubmit={handleNotaDebito(onSubmitNotaDebito)}
              className="w-full"
            >
              {renderFormFields(
                "notaDebito",
                registerNotaDebito,
                errorsNotaDebito,
                setValueNotaDebito,
                watchNotaDebito
              )}
            </form>
          </TabPanel>

          {/* Factura de Compra */}
          <TabPanel
            header={
              <span
                className="d-flex align-items-center"
                style={{ color: "#132030" }}
              >
                Factura de Compra
                <i
                  className="fa-solid fa-file-invoice ms-1"
                  style={{ color: "#132030" }}
                ></i>
              </span>
            }
          >
            <form onSubmit={handleCompra(onSubmitCompra)} className="w-full">
              {renderFormFields(
                "compra",
                registerCompra,
                errorsCompra,
                setValueCompra,
                watchCompra
              )}
            </form>
          </TabPanel>
        </TabView>
      </Card>
    </div>
  );
};

export default BillingConfigTab; 
