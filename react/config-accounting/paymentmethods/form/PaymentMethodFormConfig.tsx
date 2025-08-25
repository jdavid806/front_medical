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
  { label: "Transferencia", value: "supplier_expiration" },
  { label: "Vencimiento Clientes", value: "customer_expiration" },
  { label: "Anticipo Clientes", value: "customer_advance" },
  { label: "Anticipo Proveedores", value: "supplier_advance" },
];

const TypeMethod = [
  { label: "Compras", value: "Compras" },
  { label: "Ventas", value: "Ventas" },

];

const PaymentMethodFormConfig: React.FC<PaymentMethodFormProps> = ({
  formId,
  onSubmit,
  initialData,
  onCancel,
  loading = false,
}) => {
  // Use the accounting accounts hook
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
      account: null,
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
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  return (
    <form id={formId} onSubmit={handleSubmit(onFormSubmit)}>
      <div className="mb-3">
        <Controller
          name="name"
          control={control}
          rules={{ required: "El nombre del método es requerido" }}
          render={({ field }) => (
            <>
              <label htmlFor={field.name} className="form-label">
                Nombre del Método *
              </label>
              <InputText
                id={field.name}
                className={classNames("w-100", {
                  "p-invalid": errors.name,
                })}
                {...field}
              />
            </>
          )}
        />
        {getFormErrorMessage("name")}
      </div>

      <div className="mb-3">
        <Controller
          name="payment_type"
          control={control}
          rules={{ required: "el tipo metodo pago es requerida" }}
          render={({ field }) => (
            <>
              <label htmlFor={field.name} className="form-label">
                Tipo *
              </label>
              <Dropdown
                id={field.name}
                options={TypeMethod}
                optionLabel="label"
                optionValue="value"
                className={classNames("w-100", {
                  "p-invalid": errors.payment_type,
                })}
                {...field}
              />
            </>
          )}
        />
        {getFormErrorMessage("payment_type")}
      </div>
      <div className="mb-3">
        <Controller
          name="category"
          control={control}
          rules={{ required: "La categoría es requerida" }}
          render={({ field }) => (
            <>
              <label htmlFor={field.name} className="form-label">
                Categoría *
              </label>
              <Dropdown
                id={field.name}
                options={categories}
                optionLabel="label"
                optionValue="value"
                className={classNames("w-100", {
                  "p-invalid": errors.category,
                })}
                {...field}
              />
            </>
          )}
        />
        {getFormErrorMessage("category")}
      </div>

      <div className="mb-3">
        <Controller
          name="account"
          control={control}
          rules={{ required: "La cuenta contable es requerida" }}
          render={({ field }) => (
            <>
              <label htmlFor={field.name} className="form-label">
                Cuenta Contable *
              </label>
              <Dropdown
                id={field.name}
                options={accounts}
                optionLabel="account_name" // Cambiado de "name" a "account_name"
                optionValue="id"
                className={classNames("w-100", {
                  "p-invalid": errors.account,
                })}
                loading={isLoadingAccounts}
                value={field.value?.id || null}
                onChange={(e) => {
                  const selectedAccount = accounts.find(
                    (acc) => acc.id === e.value
                  );
                  field.onChange(selectedAccount || null);
                }}
                filter
                filterBy="account_name,account_code"
                showClear
                placeholder="Seleccione una cuenta"
                appendTo={"self"}
              />
            </>
          )}
        />
        {getFormErrorMessage("account")}
      </div>

      <div className="mb-3">
        <Controller
          name="additionalDetails"
          control={control}
          render={({ field }) => (
            <>
              <label htmlFor={field.name} className="form-label">
                Detalles Adicionales
              </label>
              <InputTextarea
                id={field.name}
                className="w-100"
                rows={3}
                {...field}
              />
            </>
          )}
        />
      </div>

      <div className="d-flex justify-content-center mt-4 gap-6">
        {onCancel && (
          <Button
            label="Cancelar"
            className="btn btn-phoenix-secondary"
            onClick={onCancel}
            style={{ padding: "0 20px", width: "200px", height: "50px", borderRadius: "0px" }}
            type="button"
            disabled={loading}

          >
            <i className="fas fa-times"></i>
          </Button>
        )}
        <Button
          type="submit"
          label="Guardar"
          className="p-button-sm"
          disabled={loading || !isDirty}
          style={{
            padding: "0 40px",
            width: "200px",
            height: "50px",
            borderRadius: "0px",
          }}
        >
          <i className="fas fa-save"></i>
        </Button>
      </div>
    </form>
  );
};

export default PaymentMethodFormConfig;
