import React from "react";
import { Controller, useForm } from "react-hook-form";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { useUsers } from "../hooks/useUsers";

interface DisabilityFormInputs {
  user_id: number;
  start_date: string | Date;
  end_date: string | Date;
  reason: string;
  id?: number;
  isEditing?: boolean;
}

interface DisabilityFormProps {
  onHandleSubmit: (data: DisabilityFormInputs) => void;
  initialData?: DisabilityFormInputs;
}

export const DisabilityForm: React.FC<DisabilityFormProps> = ({
  onHandleSubmit,
  initialData,
}) => {
  const { users, loading: usersLoading } = useUsers();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<DisabilityFormInputs>({
    defaultValues: initialData || { 
      user_id: 0,
      start_date: "",
      end_date: "",
      reason: ""
    },
  });

  const startDate = watch("start_date");

  // Preparar opciones para el dropdown de usuarios
  const userOptions = users.map(user => ({
    label: `${user.first_name} ${user.middle_name || ''} ${user.last_name} ${user.second_last_name || ''}`.replace(/\s+/g, ' ').trim(),
    value: user.id,
    specialty: user.specialty?.name || user.user_specialty_name || 'N/A'
  }));

  React.useEffect(() => {
    reset(initialData || { 
      user_id: 0,
      start_date: "",
      end_date: "",
      reason: ""
    });
  }, [initialData, reset]);

  const onSubmit = (data: DisabilityFormInputs) => {
    // Convert dates to proper format if they are Date objects
    const formattedData = {
      ...data,
      start_date: data.start_date instanceof Date 
        ? data.start_date.toISOString().split('T')[0] 
        : data.start_date,
      end_date: data.end_date instanceof Date 
        ? data.end_date.toISOString().split('T')[0] 
        : data.end_date,
    };
    onHandleSubmit(formattedData);
  };

  const getFormErrorMessage = (name: keyof DisabilityFormInputs) => {
    return errors[name] ? (
      <small className="p-error">{errors[name]?.message}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
      <div className="field">
        <label htmlFor="user_id" className="block mb-2">
          Médico *
        </label>
        <Controller
          name="user_id"
          control={control}
          rules={{
            required: "El médico es requerido",
            validate: (value) => value > 0 || "Debe seleccionar un médico",
          }}
          render={({ field, fieldState }) => (
            <Dropdown
              id={field.name}
              value={field.value}
              onChange={(e) => field.onChange(e.value)}
              options={userOptions}
              optionLabel="label"
              optionValue="value"
              placeholder={usersLoading ? "Cargando médicos..." : "Seleccione un médico"}
              filter
              filterBy="label"
              showClear
              emptyMessage="No se encontraron médicos"
              className={classNames({
                "p-invalid": fieldState.error,
              })}
              disabled={usersLoading}
              itemTemplate={(option) => (
                <div>
                  <div style={{ fontWeight: 'bold' }}>{option.label}</div>
                  <div style={{ fontSize: '0.8em', color: '#666' }}>
                    Especialidad: {option.specialty}
                  </div>
                </div>
              )}
            />
          )}
        />
        {getFormErrorMessage("user_id")}
      </div>

      <div className="field">
        <label htmlFor="start_date" className="block mb-2">
          Fecha de inicio *
        </label>
        <Controller
          name="start_date"
          control={control}
          rules={{
            required: "La fecha de inicio es requerida",
          }}
          render={({ field, fieldState }) => (
            <Calendar
              id={field.name}
              value={field.value ? new Date(field.value) : null}
              onChange={(e) => field.onChange(e.value)}
              dateFormat="yy-mm-dd"
              showIcon
              className={classNames({
                "p-invalid": fieldState.error,
              })}
            />
          )}
        />
        {getFormErrorMessage("start_date")}
      </div>

      <div className="field">
        <label htmlFor="end_date" className="block mb-2">
          Fecha de fin *
        </label>
        <Controller
          name="end_date"
          control={control}
          rules={{
            required: "La fecha de fin es requerida",
            validate: (value) => {
              if (startDate && value) {
                const start = new Date(startDate);
                const end = new Date(value);
                return end >= start || "La fecha de fin debe ser posterior o igual a la fecha de inicio";
              }
              return true;
            }
          }}
          render={({ field, fieldState }) => (
            <Calendar
              id={field.name}
              value={field.value ? new Date(field.value) : null}
              onChange={(e) => field.onChange(e.value)}
              dateFormat="yy-mm-dd"
              showIcon
              minDate={startDate ? new Date(startDate) : undefined}
              className={classNames({
                "p-invalid": fieldState.error,
              })}
            />
          )}
        />
        {getFormErrorMessage("end_date")}
      </div>

      <div className="field">
        <label htmlFor="reason" className="block mb-2">
          Razón *
        </label>
        <Controller
          name="reason"
          control={control}
          rules={{
            required: "La razón es requerida",
            minLength: {
              value: 3,
              message: "La razón debe tener al menos 3 caracteres",
            },
            maxLength: {
              value: 500,
              message: "La razón no puede exceder 500 caracteres",
            },
          }}
          render={({ field, fieldState }) => (
            <InputTextarea
              id={field.name}
              {...field}
              rows={4}
              className={classNames({
                "p-invalid": fieldState.error,
              })}
            />
          )}
        />
        {getFormErrorMessage("reason")}
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
