import React, { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import {
  CostCenterFormInputs,
  CostCenterFormProps,
} from "../interfaces/CostCenterFormConfigType";

const CostCenterFormConfig: React.FC<CostCenterFormProps> = ({
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
    reset,
  } = useForm<CostCenterFormInputs>({
    defaultValues: {
      name: "",
      code: "",
      description: "",
    },
  });

  // Resetear el formulario cuando cambian los datos iniciales
  useEffect(() => {
    reset(initialData || {
      name: "",
      code: "",
      description: "",
    });
  }, [initialData, reset]);



  const onFormSubmit: SubmitHandler<CostCenterFormInputs> = (data) => {
    onSubmit(data);
  };

  const getFormErrorMessage = (name: keyof CostCenterFormInputs) => {
    return (
      errors[name] && <small className="p-error">{errors[name]?.message}</small>
    );
  };

  return (
    <form id={formId} onSubmit={handleSubmit(onFormSubmit)} className="p-fluid">
      {/* Campo Código */}
      <div className="field mb-4">
        <label htmlFor="code" className="font-medium block mb-2">
          Código *
        </label>
        <Controller
          name="code"
          control={control}
          rules={{ required: "El código es requerido" }}
          render={({ field, fieldState }) => (
            <>
              <InputText
                id={field.name}
                {...field}
                className={classNames("w-full", {
                  "p-invalid": fieldState.error,
                })}
                placeholder="Ingrese el código"
              />
              {getFormErrorMessage("code")}
            </>
          )}
        />
      </div>

      {/* Campo Nombre */}
      <div className="field mb-4">
        <label htmlFor="name" className="font-medium block mb-2">
          Nombre del Centro de Costo *
        </label>
        <Controller
          name="name"
          control={control}
          rules={{ required: "El nombre es requerido" }}
          render={({ field, fieldState }) => (
            <>
              <InputText
                id={field.name}
                {...field}
                className={classNames("w-full", {
                  "p-invalid": fieldState.error,
                })}
                placeholder="Ingrese el nombre"
              />
              {getFormErrorMessage("name")}
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

      {/* Botones de Acción */}
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
    </form>
  );
};

export default CostCenterFormConfig;