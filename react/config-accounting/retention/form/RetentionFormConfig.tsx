import React, { useEffect } from "react";
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
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm<RetentionFormInputs>({
    defaultValues: initialData || {
      name: "",
      percentage: 0,
      accounting_account: null,
      accounting_account_reverse_id: null,
      description: "",
    },
  });

  const selectedAccount = watch("accounting_account");
  const selectedReverseAccount = watch("accounting_account_reverse_id");

  const onFormSubmit: SubmitHandler<RetentionFormInputs> = (data) => {
    onSubmit(data);
  };

  const getFormErrorMessage = (name: keyof RetentionFormInputs) => {
    return (
      errors[name] && <small className="p-error">{errors[name]?.message}</small>
    );
  };

  useEffect(() => {
    reset(
      initialData || {
        name: "",
        percentage: 0,
        accounting_account: null,
        accounting_account_reverse_id: null,
        description: "",
      }
    );
  }, [initialData, reset]);

  return (
    <form id={formId} onSubmit={handleSubmit(onFormSubmit)} className="p-fluid">
      {/* Campo Nombre */}
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

      {/* Campo Porcentaje */}
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

      {/* Campo Cuenta Contable Principal */}
      <div className="field mb-4">
        <label htmlFor="accounting_account" className="font-medium block mb-2">
          Cuenta Contable *
        </label>
        <Controller
          name="accounting_account"
          control={control}
          rules={{
            required: "La cuenta contable es requerida",
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
                loading={isLoadingAccounts}
                appendTo="self"
              />
              {getFormErrorMessage("accounting_account")}
            </>
          )}
        />
      </div>

      {/* Campo Cuenta Contable Reversa */}
      <div className="field mb-4">
        <label
          htmlFor="accounting_account_reverse_id"
          className="font-medium block mb-2"
        >
          Cuenta Contable Reversa *
        </label>
        <Controller
          name="accounting_account_reverse_id"
          control={control}
          rules={{
            required: "La cuenta contable reversa es requerida",
            validate: (value) => {
              if (!value) return "Seleccione una cuenta válida";
              if (selectedAccount && value === Number(selectedAccount)) {
                return "No puede ser la misma cuenta principal";
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
                  (acc) => !selectedAccount || acc.id !== Number(selectedAccount)
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
                loading={isLoadingAccounts}
                appendTo="self"
              />
              {getFormErrorMessage("accounting_account_reverse_id")}
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
          >
            <i className="fas fa-times"></i>
          </Button>
        )}
        <Button
          label="Guardar"
          className="p-button-sm"
          loading={loading}
          style={{ padding: "0 40px", width: "200px", height: "50px" }}
          disabled={loading || !isDirty}
          type="submit"
        >
          <i className="fas fa-save"></i>
        </Button>
      </div>
    </form>
  );
};

export default RetentionFormConfig;