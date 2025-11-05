import React, { use, useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { useAccountingAccounts } from "../../../accounting/hooks/useAccountingAccounts";
import { RetentionFormInputs } from "../interfaces/RetentionDTO";
import { RetentionFormProps } from "../interfaces/RetentionFormConfigType";
import { taxesService } from "../../../../services/api";

const RetentionFormConfig: React.FC<RetentionFormProps> = ({
  formId,
  onSubmit,
  initialData,
  onCancel,
  loading = false,
}) => {
  const { accounts, isLoading: isLoadingAccounts } = useAccountingAccounts();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<RetentionFormInputs>({
    defaultValues: initialData || {
      name: "",
      percentage: 0,
      accounting_account_id: null,
      accounting_account_reverse_id: null,
      sell_accounting_account_id: null,
      sell_reverse_accounting_account_id: null,
      description: "",
    },
  });

  // Watch para las cuentas seleccionadas actualmente
  const selectedPurchaseAccount = watch("accounting_account_id");
  const selectedPurchaseReverseAccount = watch("accounting_account_reverse_id");
  const selectedSellAccount = watch("sell_accounting_account_id");
  const selectedSellReverseAccount = watch("sell_reverse_accounting_account_id");
  const [taxes, setTaxes] = React.useState<any[]>([]);
  const [selectedTax, setSelectedTax] = React.useState<any>(null);

  const onFormSubmit: SubmitHandler<RetentionFormInputs> = (data) => {
    onSubmit(data);
  };

  const getFormErrorMessage = (name: keyof RetentionFormInputs) => {
    return (
      errors[name] && <small className="p-error">{errors[name]?.message}</small>
    );
  };

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || "",
        percentage: initialData.percentage || 0,
        accounting_account_id: initialData.accounting_account_id || null,
        accounting_account_reverse_id: initialData.accounting_account_reverse_id || null,
        sell_accounting_account_id: initialData.sell_accounting_account_id || null,
        sell_reverse_accounting_account_id: initialData.sell_reverse_accounting_account_id || null,
        description: initialData.description || "",
        tax_id: initialData.tax_id || null,
      });
    } else {
      reset({
        name: "",
        percentage: 0,
        accounting_account_id: null,
        accounting_account_reverse_id: null,
        sell_accounting_account_id: null,
        sell_reverse_accounting_account_id: null,
        description: "",
      });
    }
  }, [initialData, reset]);

  useEffect(() => {
    fetchTaxes();
  }, []);

  // Función auxiliar para encontrar una cuenta por ID
  const findAccountById = (accountId: number | null) => {
    if (!accountId || !accounts) return null;
    return accounts.find(account => account.id === accountId) || null;
  };

  async function fetchTaxes() {
    try {
      const taxes = await taxesService.getAll();
      setTaxes(taxes.data);
    } catch (error) {
      console.error("Error fetching taxes:", error);
    }
  }

  // FUNCIONES MEJORADAS PARA GARANTIZAR QUE LAS CUENTAS SELECCIONADAS SIEMPRE ESTÉN EN LAS OPCIONES
  const getPurchaseAccounts = () => {
    if (!accounts || accounts.length === 0) return [];

    const selectedAccount = selectedPurchaseAccount ? findAccountById(selectedPurchaseAccount) : null;
    const accountsList = [...accounts];

    // Si la cuenta seleccionada no está en la lista principal, la agregamos
    if (selectedAccount && !accountsList.some(acc => acc.id === selectedAccount.id)) {
      accountsList.push(selectedAccount);
    }

    return accountsList;
  };

  const getPurchaseReverseAccounts = () => {
    if (!accounts || accounts.length === 0) return [];

    const selectedAccount = selectedPurchaseReverseAccount ? findAccountById(selectedPurchaseReverseAccount) : null;
    const accountsList = [...accounts];

    if (selectedAccount && !accountsList.some(acc => acc.id === selectedAccount.id)) {
      accountsList.push(selectedAccount);
    }

    return accountsList;
  };

  const getSellAccounts = () => {
    if (!accounts || accounts.length === 0) return [];

    const selectedAccount = selectedSellAccount ? findAccountById(selectedSellAccount) : null;
    const accountsList = [...accounts];

    if (selectedAccount && !accountsList.some(acc => acc.id === selectedAccount.id)) {
      accountsList.push(selectedAccount);
    }

    return accountsList;
  };

  const getSellReverseAccounts = () => {
    if (!accounts || accounts.length === 0) return [];

    const selectedAccount = selectedSellReverseAccount ? findAccountById(selectedSellReverseAccount) : null;
    const accountsList = [...accounts];

    if (selectedAccount && !accountsList.some(acc => acc.id === selectedAccount.id)) {
      accountsList.push(selectedAccount);
    }

    return accountsList;
  };

  return (
    <form id={formId} onSubmit={handleSubmit(onFormSubmit)} className="p-fluid">
      <div className="row">
        <div className="col-md-6">
          <div className="field mb-4">
            <label htmlFor="name" className="font-medium block mb-2">
              Nombre de la Retención *
            </label>
            <Controller
              name="name"
              control={control}
              rules={{
                required: "El nombre de la retención es requerido",
                maxLength: {
                  value: 100,
                  message: "El nombre no puede exceder 100 caracteres",
                },
              }}
              render={({ field, fieldState }) => (
                <>
                  <InputText
                    id={field.name}
                    {...field}
                    className={classNames({ "p-invalid": fieldState.error })}
                    placeholder="Ingrese el nombre de la retención"
                  />
                  {getFormErrorMessage("name")}
                </>
              )}
            />
          </div>
        </div>

        <div className="col-md-6">
          <div className="field mb-4">
            <label htmlFor="percentage" className="font-medium block mb-2">
              Porcentaje (%) *
            </label>
            <Controller
              name="percentage"
              control={control}
              rules={{
                required: "El porcentaje es requerido",
                min: {
                  value: 0,
                  message: "El porcentaje no puede ser negativo",
                },
                max: {
                  value: 100,
                  message: "El porcentaje no puede ser mayor a 100",
                },
              }}
              render={({ field, fieldState }) => (
                <>
                  <InputNumber
                    id={field.name}
                    value={field.value}
                    onValueChange={(e) => field.onChange(e.value)}
                    mode="decimal"
                    min={0}
                    max={100}
                    suffix="%"
                    className={classNames("w-full", {
                      "p-invalid": fieldState.error,
                    })}
                    placeholder="Ej: 10"
                  />
                  {getFormErrorMessage("percentage")}
                </>
              )}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="field mb-4">
            <label htmlFor="tax_id" className="font-medium block mb-2 fw-bold">
              Impuesto *
            </label>
            <Controller
              name="tax_id"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <Dropdown
                    id={field.name}
                    value={field.value}
                    onChange={(e) => field.onChange(e.value)}
                    options={taxes}
                    optionValue="id"
                    optionLabel="name"
                    placeholder="Seleccione un impuesto"
                    filter
                    showClear
                    className={classNames("w-full", {
                      "p-invalid": fieldState.error,
                    })}
                    loading={isLoadingAccounts}
                    appendTo="self"
                  />
                  {getFormErrorMessage("tax_id")}
                </>
              )}
            />
          </div>
        </div>
      </div>

      <div className="row">
        {/* Columna Compras */}
        <div className="col-md-6">
          <div className="field mb-3">
            <label className="font-medium block mb-2 fw-bold">
              Configuración Compras *
            </label>
          </div>

          <div className="field mb-4">
            <label htmlFor="accounting_account_id" className="font-medium block mb-2 fw-bold">
              Cuenta Contable Compras *
            </label>
            <Controller
              name="accounting_account_id"
              control={control}

              render={({ field, fieldState }) => (
                <>
                  <Dropdown
                    id={field.name}
                    value={field.value}
                    onChange={(e) => field.onChange(e.value)}
                    options={getPurchaseAccounts()}
                    optionValue="id"
                    optionLabel="account_label"
                    placeholder="Seleccione una cuenta"
                    filter
                    showClear
                    className={classNames("w-full")}
                    loading={isLoadingAccounts}
                    appendTo="self"
                  />
                </>
              )}
            />
          </div>

          <div className="field mb-4">
            <label
              htmlFor="accounting_account_reverse_id"
              className="font-medium block mb-2 fw-bold"
            >
              Cuenta Contable Reversa Compras *
            </label>
            <Controller
              name="accounting_account_reverse_id"
              control={control}
              render={({ field }) => (
                <>
                  <Dropdown
                    id={field.name}
                    value={field.value}
                    onChange={(e) => field.onChange(e.value)}
                    options={getPurchaseReverseAccounts()}
                    optionValue="id"
                    optionLabel="account_label"
                    placeholder="Seleccione una cuenta"
                    filter
                    filterBy="account_label,account_name,account_code"
                    showClear
                    className={classNames("w-full")}
                    loading={isLoadingAccounts}
                    appendTo="self"
                  />
                </>
              )}
            />
          </div>
        </div>

        {/* Columna Ventas */}
        <div className="col-md-6">
          <div className="field mb-3">
            <label className="font-medium block mb-2 fw-bold">
              Configuración Ventas *
            </label>
          </div>

          <div className="field mb-4">
            <label htmlFor="sell_accounting_account_id" className="font-medium block mb-2 fw-bold">
              Cuenta Contable Ventas *
            </label>
            <Controller
              name="sell_accounting_account_id"
              control={control}
              render={({ field }) => (
                <>
                  <Dropdown
                    id={field.name}
                    value={field.value}
                    onChange={(e) => field.onChange(e.value)}
                    options={getSellAccounts()}
                    optionValue="id"
                    optionLabel="account_label"
                    placeholder="Seleccione una cuenta"
                    filter
                    filterBy="account_label,account_name,account_code"
                    showClear
                    className={classNames("w-full")}
                    loading={isLoadingAccounts}
                    appendTo="self"
                  />
                </>
              )}
            />
          </div>

          <div className="field mb-4">
            <label
              htmlFor="sell_reverse_accounting_account_id"
              className="font-medium block mb-2 fw-bold"
            >
              Cuenta Contable Reversa Ventas *
            </label>
            <Controller
              name="sell_reverse_accounting_account_id"
              control={control}
              render={({ field }) => (
                <>
                  <Dropdown
                    id={field.name}
                    value={field.value}
                    onChange={(e) => field.onChange(e.value)}
                    options={getSellReverseAccounts()}
                    optionValue="id"
                    optionLabel="account_label"
                    placeholder="Seleccione una cuenta"
                    filter
                    filterBy="account_label,account_name,account_code"
                    showClear
                    className={classNames("w-full")}
                    loading={isLoadingAccounts}
                    appendTo="self"
                  />
                </>
              )}
            />
          </div>
        </div>
      </div>

      {/* Descripción - Ancho completo */}
      <div className="row">
        <div className="col-12">
          <div className="field mb-4">
            <label htmlFor="description" className="font-medium block mb-2">
              Descripción
            </label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <InputTextarea
                  id={field.name}
                  {...field}
                  rows={3}
                  className="w-full"
                  placeholder="Ingrese una descripción opcional"
                />
              )}
            />
          </div>
        </div>
      </div>

      {/* Botones - Ancho completo */}
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-center mt-4 gap-6">
            {onCancel && (
              <Button
                label="Cancelar"
                className="btn btn-phoenix-secondary"
                onClick={onCancel}
                disabled={loading}
                type="button"
                style={{
                  padding: "0 20px",
                  width: "200px",
                  height: "50px",
                  borderRadius: "0px",
                }}
              >
                <i className="fas fa-times"></i>
              </Button>
            )}
            <Button
              label="Guardar"
              className="p-button-sm"
              loading={loading}
              style={{ padding: "0 40px", width: "200px", height: "50px" }}
              disabled={loading}
              type="submit"
            >
              <i className="fas fa-save"></i>
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default RetentionFormConfig;