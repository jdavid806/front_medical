import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import { Divider } from "primereact/divider";
import {
  DepreciationAppreciationFormInputs,
  DepreciationAppreciationFormProps,
} from "../interfaces/DepreciationAppreciationFormType";

const typeOptions = [
  { label: "Depreciación", value: "depreciation" },
  { label: "Apreciación", value: "appreciation" },
];

const frequencyOptions = [
  { label: "Anual", value: "annual" },
  { label: "Semestral", value: "semiannual" },
  { label: "Trimestral", value: "quarterly" },
  { label: "Mensual", value: "monthly" },
];

const DepreciationAppreciationForm: React.FC<
  DepreciationAppreciationFormProps
> = ({
  formId,
  onSubmit,
  initialData,
  onCancel,
  loading = false,
  currentValue,
}) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<DepreciationAppreciationFormInputs>({
    defaultValues: initialData || {
      type: "depreciation",
      amount: 0,
      date: new Date(),
    },
  });

  const type = watch("type");

  const onFormSubmit: SubmitHandler<DepreciationAppreciationFormInputs> = (
    data
  ) => onSubmit(data);

  const getFormErrorMessage = (
    name: keyof DepreciationAppreciationFormInputs
  ) => {
    return (
      errors[name] && <small className="p-error">{errors[name]?.message}</small>
    );
  };

  return (
    <form id={formId} onSubmit={handleSubmit(onFormSubmit)} className="p-fluid">
      {/* Sección Tipo de Ajuste */}
      <div className="mb-4">
        <label htmlFor="type" className="font-medium text-900 block mb-2">
          Tipo de ajuste *
        </label>
        <Controller
          name="type"
          control={control}
          rules={{ required: "El tipo de ajuste es requerido" }}
          render={({ field }) => (
            <Dropdown
              id="type"
              options={typeOptions}
              optionLabel="label"
              placeholder="Seleccione tipo"
              className={classNames("w-full", {
                "p-invalid": errors.type,
              })}
              value={field.value}
              onChange={(e) => field.onChange(e.value)}
              appendTo={"self"}
            />
          )}
        />
        {getFormErrorMessage("type")}
      </div>

      <Divider />

      {/* Sección Depreciación (solo visible cuando tipo es depreciación) */}
      {type === "depreciation" && (
        <>
          <div className="grid">
            <div className="col-12 md:col-6">
              <div className="mb-3">
                <label
                  htmlFor="frequency"
                  className="font-medium text-900 block mb-2"
                >
                  Frecuencia de Depreciación *
                </label>
                <Controller
                  name="frequency"
                  control={control}
                  rules={{ required: "La frecuencia es requerida" }}
                  render={({ field }) => (
                    <Dropdown
                      id="frequency"
                      options={frequencyOptions}
                      optionLabel="label"
                      placeholder="Seleccione frecuencia"
                      className={classNames("w-full", {
                        "p-invalid": errors.frequency,
                      })}
                      value={field.value}
                      onChange={(e) => field.onChange(e.value)}
                      appendTo={"self"}
                    />
                  )}
                />
                {getFormErrorMessage("frequency")}
              </div>
            </div>
            <div className="col-12 md:col-6">
              <div className="mb-3">
                <label
                  htmlFor="percentage"
                  className="font-medium text-900 block mb-2"
                >
                  Porcentaje de Depreciación *
                </label>
                <Controller
                  name="percentage"
                  control={control}
                  rules={{
                    required: "El porcentaje es requerido",
                    min: { value: 0.01, message: "Mínimo 0.01%" },
                    max: { value: 100, message: "Máximo 100%" },
                  }}
                  render={({ field }) => (
                    <div className="p-inputgroup">
                      <InputNumber
                        id="percentage"
                        value={field.value}
                        onValueChange={(e) => {
                          const roundedValue = e.value
                            ? parseFloat(e.value.toFixed(2))
                            : null;
                          field.onChange(roundedValue);
                        }}
                        mode="decimal"
                        min={0.01}
                        max={100}
                        minFractionDigits={2}
                        maxFractionDigits={2}
                        className={classNames("w-full", {
                          "p-invalid": errors.percentage,
                        })}
                      />
                      <span className="p-inputgroup-addon">%</span>
                    </div>
                  )}
                />
                {getFormErrorMessage("percentage")}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Sección Fecha */}
      <div className="grid">
        <div className="col-12">
          <div className="mb-3">
            <label htmlFor="date" className="font-medium text-900 block mb-2">
              Fecha del Ajuste *
            </label>
            <Controller
              name="date"
              control={control}
              rules={{ required: "La fecha es requerida" }}
              render={({ field }) => (
                <Calendar
                  id="date"
                  value={field.value}
                  onChange={(e) => field.onChange(e.value)}
                  dateFormat="dd/mm/yy"
                  showIcon
                  className={classNames("w-full", {
                    "p-invalid": errors.date,
                  })}
                />
              )}
            />
            {getFormErrorMessage("date")}
          </div>
        </div>
      </div>

      {/* Sección Motivos y Monto (solo visible cuando tipo es apreciación) */}
      {type === "appreciation" && (
        <>
          <div className="mb-3">
            <label
              htmlFor="reasons"
              className="font-medium text-900 block mb-2"
            >
              Motivos de la Apreciación *
            </label>
            <Controller
              name="reasons"
              control={control}
              rules={{ required: "Los motivos son requeridos" }}
              render={({ field }) => (
                <InputText
                  id="reasons"
                  className={classNames("w-full", {
                    "p-invalid": errors.reasons,
                  })}
                  placeholder="Describa los motivos del incremento de valor"
                  {...field}
                />
              )}
            />
            {getFormErrorMessage("reasons")}
          </div>

          <div className="mb-3">
            <label htmlFor="amount" className="font-medium text-900 block mb-2">
              Monto del Ajuste *
            </label>
            <Controller
              name="amount"
              control={control}
              rules={{
                required: "El monto es requerido",
                min: { value: 0.01, message: "Mínimo RD$0.01" },
              }}
              render={({ field }) => (
                <InputNumber
                  id="amount"
                  value={field.value}
                  onValueChange={(e) => field.onChange(e.value)}
                  mode="currency"
                  currency="DOP"
                  locale="es-DO"
                  min={0.01}
                  className={classNames("w-full", {
                    "p-invalid": errors.amount,
                  })}
                />
              )}
            />
            <small className="text-500">
              Valor actual:{" "}
              {currentValue.toLocaleString("es-DO", {
                style: "currency",
                currency: "DOP",
              })}
            </small>
            {getFormErrorMessage("amount")}
          </div>
        </>
      )}

      <Divider />

      {/* Botones de acción */}
      <div className="flex justify-content-end gap-2 mt-4">
        {onCancel && (
          <Button
            label="Cancelar"
            icon="pi pi-times"
            className="p-button-text p-button-sm"
            onClick={onCancel}
            disabled={loading}
          />
        )}
        <Button
          type="submit"
          label="Guardar Ajuste"
          icon="pi pi-check"
          className="p-button-sm"
          loading={loading}
        />
      </div>
    </form>
  );
};

export default DepreciationAppreciationForm;
