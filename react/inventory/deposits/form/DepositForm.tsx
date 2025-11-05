import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";

// Definimos los tipos de datos del formulario
import { DepositFormInputs, DepositFormProps } from "../ts/depositFormType";
import { Dropdown } from "primereact/dropdown";
import { depositTypes } from "../ts/consts";

const DepositForm: React.FC<DepositFormProps> = ({
  formId,
  onSubmit,
  initialData,
  onCancel,
  loading = false,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DepositFormInputs>({
    defaultValues: initialData || {
      name: "",
      type: null,
      notes: "",
    },
  });

  const depositTypeOptions = Object.entries(depositTypes).map(([key, value]) => ({
    label: value,
    value: key,
  }));

  const onFormSubmit: SubmitHandler<DepositFormInputs> = (data) =>
    onSubmit(data);

  const getFormErrorMessage = (name: keyof DepositFormInputs) => {
    return (
      errors[name] && <small className="p-error">{errors[name]?.message}</small>
    );
  };

  return (
    <form id={formId} onSubmit={handleSubmit(onFormSubmit)}>
      <div className="mb-3">
        <Controller
          name="name"
          control={control}
          rules={{ required: "El nombre del depósito es requerido" }}
          render={({ field }) => (
            <>
              <label htmlFor={field.name} className="form-label">
                Nombre del Depósito *
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
          name="type"
          control={control}
          rules={{ required: "El tipo del depósito es requerido" }}
          render={({ field }) => (
            <>
              <label htmlFor={field.name} className="form-label">
                Tipo del Depósito *
              </label>
              <Dropdown
                id={field.name}
                className={classNames("w-100", {
                  "p-invalid": errors.type,
                })}
                {...field}
                options={depositTypeOptions}
                optionLabel="label"
                optionValue="value"
              />
            </>
          )}
        />
        {getFormErrorMessage("type")}
      </div>

      <div className="mb-3">
        <Controller
          name="notes"
          control={control}
          render={({ field }) => (
            <>
              <label htmlFor={field.name} className="form-label">
                Notas/Observaciones
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

      <div className="d-flex justify-content-end mt-4">
        <Button
          type="submit"
          label="Guardar"
          icon="pi pi-check"
          className="p-button-sm"
          loading={loading}
        />
        {onCancel && (
          <Button
            label="Cancelar"
            className="p-button-text"
            onClick={onCancel}
            disabled={loading}
          />
        )}
      </div>
    </form>
  );
};

export default DepositForm;
