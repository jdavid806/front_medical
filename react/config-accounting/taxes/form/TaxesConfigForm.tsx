import React, { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { TaxFormInputs } from "../interfaces/TaxesConfigDTO";
import { TaxFormProps } from "../interfaces/TaxesFormtType";

const TaxFormConfig: React.FC<TaxFormProps> = ({
  formId,
  onSubmit,
  initialData,
  onCancel,
  loading = false,
  accounts,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm<TaxFormInputs>({
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

  // Observar cambios en las cuentas para validaciones cruzadas
  const selectedPurchaseAccount = watch("accounting_account_id");
  const selectedSellAccount = watch("sell_accounting_account_id");

  const onFormSubmit: SubmitHandler<TaxFormInputs> = (data) => {
    onSubmit(data);
  };

  const getFormErrorMessage = (name: keyof TaxFormInputs) => {
    return (
      errors[name] && <small className="p-error">{errors[name]?.message}</small>
    );
  };

  useEffect(() => {
    reset(
      initialData || {
        name: "",
        percentage: 0,
        accounting_account_id: null,
        accounting_account_reverse_id: null,
        sell_accounting_account_id: null,
        sell_reverse_accounting_account_id: null,
        description: "",
      }
    );
  }, [initialData, reset]);

  return (
    <form id={formId} onSubmit={handleSubmit(onFormSubmit)} className="p-fluid">
      {/* Campo Nombre */}
      <div className="field mb-4">
        <label htmlFor="name" className="font-medium block mb-2">
          Nombre del Impuesto *
        </label>
        <Controller
          name="name"
          control={control}
          rules={{
            required: "El nombre del impuesto es requerido",
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
                placeholder="Ingrese el nombre del impuesto"
              />
              {getFormErrorMessage("name")}
            </>
          )}
        />
      </div>

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
                placeholder="Ej: 19"
              />
              {getFormErrorMessage("percentage")}
            </>
          )}
        />
      </div>

      {/* Configuración Compras */}
      <div className="field mb-4">
        <label className="font-medium block mb-2">
          Configuración Compras *
        </label>
      </div>

      <div className="field mb-4">
        <label htmlFor="accounting_account_id" className="font-medium block mb-2">
          Cuenta Contable Compras *
        </label>
        <Controller
          name="accounting_account_id"
          control={control}
          rules={{
            required: "La cuenta contable de compras es requerida",
          }}
          render={({ field, fieldState }) => (
            <>
              <Dropdown
                id={field.name}
                value={field.value}
                onChange={(e) => field.onChange(e.value)}
                options={accounts}
                optionValue="id"
                optionLabel="account_name"
                placeholder="Seleccione una cuenta"
                filter
                filterBy="account_name,account_code"
                showClear
                className={classNames("w-full", {
                  "p-invalid": fieldState.error,
                })}
                loading={false}
              />
              {getFormErrorMessage("accounting_account_id")}
            </>
          )}
        />
      </div>

      <div className="field mb-4">
        <label
          htmlFor="accounting_account_reverse_id"
          className="font-medium block mb-2"
        >
          Cuenta Contable Reversa Compras *
        </label>
        <Controller
          name="accounting_account_reverse_id"
          control={control}
          rules={{
            required: "La cuenta contable reversa de compras es requerida",
            validate: (value) => {
              if (value === selectedPurchaseAccount) {
                return "No puede ser la misma cuenta principal de compras";
              }
              return true;
            },
          }}
          render={({ field, fieldState }) => (
            <>
              <Dropdown
                id={field.name}
                value={field.value}
                onChange={(e) => field.onChange(e.value)}
                options={accounts.filter(
                  (acc) => acc.id !== selectedPurchaseAccount
                )}
                optionLabel="account_name"
                placeholder="Seleccione una cuenta"
                filter
                optionValue="id"
                filterBy="account_name,account_code"
                showClear
                className={classNames("w-full", {
                  "p-invalid": fieldState.error,
                })}
                loading={false}
              />
              {getFormErrorMessage("accounting_account_reverse_id")}
            </>
          )}
        />
      </div>

      {/* Configuración Ventas */}
      <div className="field mb-4">
        <label className="font-medium block mb-2">
          Configuración Ventas *
        </label>
      </div>

      <div className="field mb-4">
        <label htmlFor="sell_accounting_account_id" className="font-medium block mb-2">
          Cuenta Contable Ventas *
        </label>
        <Controller
          name="sell_accounting_account_id"
          control={control}
          rules={{
            required: "La cuenta contable de ventas es requerida",
          }}
          render={({ field, fieldState }) => (
            <>
              <Dropdown
                id={field.name}
                value={field.value}
                onChange={(e) => field.onChange(e.value)}
                options={accounts}
                optionValue="id"
                optionLabel="account_name"
                placeholder="Seleccione una cuenta"
                filter
                filterBy="account_name,account_code"
                showClear
                className={classNames("w-full", {
                  "p-invalid": fieldState.error,
                })}
                loading={false}
              />
              {getFormErrorMessage("sell_accounting_account_id")}
            </>
          )}
        />
      </div>

      <div className="field mb-4">
        <label
          htmlFor="sell_reverse_accounting_account_id"
          className="font-medium block mb-2"
        >
          Cuenta Contable Reversa Ventas *
        </label>
        <Controller
          name="sell_reverse_accounting_account_id"
          control={control}
          rules={{
            required: "La cuenta contable reversa de ventas es requerida",
            validate: (value) => {
              if (value === selectedSellAccount) {
                return "No puede ser la misma cuenta principal de ventas";
              }
              return true;
            },
          }}
          render={({ field, fieldState }) => (
            <>
              <Dropdown
                id={field.name}
                value={field.value}
                onChange={(e) => field.onChange(e.value)}
                options={accounts.filter(
                  (acc) => acc.id !== selectedSellAccount
                )}
                optionLabel="account_name"
                placeholder="Seleccione una cuenta"
                filter
                optionValue="id"
                filterBy="account_name,account_code"
                showClear
                className={classNames("w-full", {
                  "p-invalid": fieldState.error,
                })}
                loading={false}
              />
              {getFormErrorMessage("sell_reverse_accounting_account_id")}
            </>
          )}
        />
      </div>

      {/* Campo Descripción */}
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

      {/* Botones de acción */}
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
          />
        )}
        <Button
          label="Guardar"
          className="p-button-sm"
          loading={loading}
          style={{ padding: "0 40px", width: "200px", height: "50px" }}
          disabled={loading || !isDirty}
          type="submit"
        />
      </div>
    </form>
  );
};

export default TaxFormConfig;