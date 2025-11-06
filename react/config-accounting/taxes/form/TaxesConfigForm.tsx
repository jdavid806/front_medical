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
  accounts = [],
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
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
      <div className="row">
        <div className="col-md-6">
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
                    placeholder="Ej: 19"
                  />
                  {getFormErrorMessage("percentage")}
                </>
              )}
            />
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="field mb-3">
            <label className="fw-bold block mb-2">
              Configuración Compras
            </label>
          </div>

          <div className="field mb-4">
            <label htmlFor="accounting_account_id" className="font-medium block mb-2">
              Cuenta Contable Compras *
            </label>
            <Controller
              name="accounting_account_id"
              control={control}

              render={({ field }) => (
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
                    className={classNames("w-full")}
                    loading={false}
                  />
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
              render={({ field }) => (
                <>
                  <Dropdown
                    id={field.name}
                    value={field.value}
                    onChange={(e) => field.onChange(e.value)}
                    options={accounts}
                    optionLabel="account_name"
                    placeholder="Seleccione una cuenta"
                    filter
                    optionValue="id"
                    filterBy="account_name,account_code"
                    showClear
                    className={classNames("w-full")}
                    loading={false}
                  />
                </>
              )}
            />
          </div>
        </div>

        <div className="col-md-6">
          <div className="field mb-3">
            <label className="fw-bold block mb-2">
              Configuración Ventas
            </label>
          </div>

          <div className="field mb-4">
            <label htmlFor="sell_accounting_account_id" className="font-medium block mb-2">
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
                    options={accounts}
                    optionValue="id"
                    optionLabel="account_name"
                    placeholder="Seleccione una cuenta"
                    filter
                    filterBy="account_name,account_code"
                    showClear
                    className={classNames("w-full")}
                    loading={false}
                  />
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
              render={({ field }) => (
                <>
                  <Dropdown
                    id={field.name}
                    value={field.value}
                    onChange={(e) => field.onChange(e.value)}
                    options={accounts}
                    optionLabel="account_name"
                    placeholder="Seleccione una cuenta"
                    filter
                    optionValue="id"
                    filterBy="account_name,account_code"
                    showClear
                    className={classNames("w-full")}
                    loading={false}
                  />
                </>
              )}
            />
          </div>
        </div>
      </div>

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

      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-center mt-4 gap-6">
            {onCancel && (
              <Button
                label="Cancelar"
                className="btn btn-phoenix-secondary"
                onClick={onCancel}
                disabled={loading}
                style={{
                  padding: "0 40px",
                  width: "200px",
                  height: "50px",
                  borderRadius: "0px",
                }}
              >
                <i className="fas fa-times mr-2"></i>
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

export default TaxFormConfig;