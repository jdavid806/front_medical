import React from "react";
import { Controller, useForm } from "react-hook-form";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";

interface CategoriesFormInputs {
  name: string;
  description: string;
  id?: string;
  isEditing?: boolean;
}

interface CategoriesFormProps {
  onHandleSubmit: (data: CategoriesFormInputs) => void;
  initialData?: CategoriesFormInputs;
}

export const CategoriesForm: React.FC<CategoriesFormProps> = ({
  onHandleSubmit,
  initialData,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoriesFormInputs>({
    defaultValues: initialData || { name: "", description: "" },
  });

  React.useEffect(() => {
    reset(initialData || { name: "", description: "" });
  }, [initialData, reset]);

  const onSubmit = (data: CategoriesFormInputs) => {
    onHandleSubmit(data);
  };

  const getFormErrorMessage = (name: keyof CategoriesFormInputs) => {
    return errors[name] ? (
      <small className="p-error">{errors[name]?.message}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
      <div className="field">
        <label htmlFor="name" className="block mb-2">
          Nombre *
        </label>
        <Controller
          name="name"
          control={control}
          rules={{
            required: "El nombre es requerido",
            minLength: {
              value: 3,
              message: "El nombre debe tener al menos 3 caracteres",
            },
            maxLength: {
              value: 50,
              message: "El nombre no puede exceder 50 caracteres",
            },
          }}
          render={({ field, fieldState }) => (
            <InputText
              id={field.name}
              {...field}
              className={classNames({
                "p-invalid": fieldState.error,
              })}
            />
          )}
        />
        {getFormErrorMessage("name")}
      </div>

      <div className="field">
        <label htmlFor="description" className="block mb-2">
          Descripción *
        </label>
        <Controller
          name="description"
          control={control}
          render={({ field, fieldState }) => (
            <InputTextarea
              id={field.name}
              {...field}
              className={classNames({
                "p-invalid": fieldState.error,
              })}
            />
          )}
        />
        {getFormErrorMessage("description")}
      </div>

      <div className="d-flex justify-content-end mt-4">
        <Button
          label="Cancelar"
          icon="pi pi-times"
          type="button"
          className="p-button-text w-30"
          onClick={() => reset()}
        />
        <Button
          label={initialData?.isEditing ? "Actualizar" : "Guardar"}
          icon="pi pi-check"
          type="submit"
          className="w-30 ml-2"
        />
      </div>
    </form>
  );
};
