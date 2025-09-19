import React, { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { useAccountingAccounts } from "../../../accounting/hooks/useAccountingAccounts";
import {
  PaymentMethodFormInputs,
  PaymentMethodFormProps,
} from "../interfaces/PaymentMethodFormConfigTypes";

// Categories for dropdown
const categories = [
  { label: "Transaccional", value: "transactional" },
  { label: "Vencimiento Proveedores", value: "supplier_expiration" },
  { label: "Transferencia", value: "transfer" },
  { label: "Vencimiento Clientes", value: "customer_expiration" },
  { label: "Anticipo Clientes", value: "customer_advance" },
  { label: "Anticipo Proveedores", value: "supplier_advance" },
];

const TypeMethod = [
  { label: "Compras", value: "purchase" },
  { label: "Ventas", value: "sale" },
  { label: "Ambos", value: "both" },
];

const PaymentMethodFormConfig: React.FC<PaymentMethodFormProps> = ({
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
  } = useForm<PaymentMethodFormInputs>({
    defaultValues: initialData || {
      name: "",
      category: "",
      payment_type: "",
      accounting_account_id: null,
      additionalDetails: "",
    },
  });

  const onFormSubmit: SubmitHandler<PaymentMethodFormInputs> = (data) =>
    onSubmit(data);

  const getFormErrorMessage = (name: keyof PaymentMethodFormInputs) => {
    return (
      errors[name] && <small className="p-error">{errors[name]?.message}</small>
    );
  };

  useEffect(() => {
    reset(
      initialData || {
        name: "",
        category: "",
        payment_type: "",
        accounting_account_id: null,
        additionalDetails: "",
      }
    );
  }, [initialData, reset]);

  return (
    <form id={formId} onSubmit={handleSubmit(onFormSubmit)} className="p-fluid">
      <div className="field mb-4">
        <label htmlFor="name" className="font-medium block mb-2">
          Nombre del Método *
        </label>
        <Controller
          name="name"
          control={control}
          rules={{
            required: "El nombre del método es requerido",
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
                placeholder="Ingrese el nombre del método de pago"
              />
              {getFormErrorMessage("name")}
            </>
          )}
        />
      </div>

      <div className="field mb-4">
        <label htmlFor="payment_type" className="font-medium block mb-2">
          Tipo *
        </label>
        <Controller
          name="payment_type"
          control={control}
          rules={{ required: "El tipo de método es requerido" }}
          render={({ field, fieldState }) => (
            <>
              <Dropdown
                id={field.name}
                value={field.value}
                onChange={(e) => field.onChange(e.value)}
                options={TypeMethod}
                optionLabel="label"
                optionValue="value"
                placeholder="Seleccione un tipo"
                className={classNames("w-full", {
                  "p-invalid": fieldState.error,
                })}
              />
              {getFormErrorMessage("payment_type")}
            </>
          )}
        />
      </div>

      <div className="field mb-4">
        <label htmlFor="category" className="font-medium block mb-2">
          Categoría *
        </label>
        <Controller
          name="category"
          control={control}
          rules={{ required: "La categoría es requerida" }}
          render={({ field, fieldState }) => (
            <>
              <Dropdown
                id={field.name}
                value={field.value}
                onChange={(e) => field.onChange(e.value)}
                options={categories}
                optionLabel="label"
                optionValue="value"
                placeholder="Seleccione una categoría"
                className={classNames("w-full", {
                  "p-invalid": fieldState.error,
                })}
              />
              {getFormErrorMessage("category")}
            </>
          )}
        />
      </div>

      <div className="field mb-4">
        <label htmlFor="accounting_account_id" className="font-medium block mb-2">
          Cuenta Contable
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
                options={accounts}
                optionValue="id"
                optionLabel="account_label"
                placeholder="Seleccione una cuenta"
                filter
                filterBy="account_label,account_name,account_code"
                showClear
                className={classNames("w-full", {
                  "p-invalid": fieldState.error,
                })}
                loading={isLoadingAccounts}
                appendTo="self"
              />
              {getFormErrorMessage("accounting_account_id")}
            </>
          )}
        />
      </div>





      <div className="field mb-4">
        <label htmlFor="additionalDetails" className="font-medium block mb-2">
          Detalles Adicionales
        </label>
        <Controller
          name="additionalDetails"
          control={control}
          render={({ field }) => (
            <InputTextarea
              id={field.name}
              {...field}
              rows={3}
              className="w-full"
              placeholder="Ingrese detalles adicionales"
            />
          )}
        />
      </div>

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

export default PaymentMethodFormConfig;