import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { useUsers } from "../../users/hooks/useUsers";
import { daysBetweenDates } from "../../../services/utilidades";
import { InputNumber } from "primereact/inputnumber";

export interface DisabilityFormInputs {
  user_id: number;
  days_disability: number;
  start_date: Date;
  end_date: Date;
  reason: string;
  id?: number;
  isEditing?: boolean;
}

interface DisabilityFormProps {
  formId?: string;
  onHandleSubmit?: (data: DisabilityFormInputs) => void;
  initialData?: DisabilityFormInputs;
  formConfig?: {
    fieldsConfig?: {
      user_id?: {
        visible: boolean;
      };
    }
  }
}

export const DisabilityForm = forwardRef(({
  formId,
  onHandleSubmit,
  initialData,
  formConfig
}: DisabilityFormProps, ref) => {
  const { users } = useUsers();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm<DisabilityFormInputs>({
    defaultValues: initialData || {
      user_id: 0,
      days_disability: 0,
      start_date: new Date(),
      end_date: new Date(),
      reason: ""
    },
  });

  const startDate = watch("start_date");

  useImperativeHandle(ref, () => ({
    resetForm: () => {
      reset();
    },
    getFormData: () => {
      const data = {
        user_id: watch("user_id"),
        days_disability: watch("days_disability"),
        start_date: new Date(),
        end_date: watch("end_date"),
        reason: watch("reason"),
        id: watch("id"),
        isEditing: watch("isEditing")
      };

      console.log(data);

      return data;
    }
  }));

  // Preparar opciones para el dropdown de usuarios
  const userOptions = users.map(user => ({
    label: `${user.first_name} ${user.middle_name || ''} ${user.last_name} ${user.second_last_name || ''}`.replace(/\s+/g, ' ').trim(),
    value: user.id,
    specialty: user.specialty?.name || 'N/A'
  }));

  React.useEffect(() => {
    reset(initialData || {
      user_id: 0,
      days_disability: 0,
      start_date: new Date(),
      end_date: new Date(),
      reason: ""
    });
  }, [initialData, reset]);

  const onSubmit = (data: DisabilityFormInputs) => {
    onHandleSubmit?.(data);
  };

  const getFormErrorMessage = (name: keyof DisabilityFormInputs) => {
    return errors[name] ? (
      <small className="p-error">{errors[name]?.message}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    );
  };

  const handleDaysChange = (days: number) => {
    if (startDate && days) {
      const start = new Date(startDate);
      const endDate = new Date(start);
      endDate.setDate(start.getDate() + days);

      setValue('end_date', endDate);
    }

    setValue('days_disability', days);
  };

  const handleEndDateChange = (date: Date) => {
    if (startDate && date) {
      const start = new Date(startDate);
      const end = new Date(date);
      const days = daysBetweenDates(start, end);

      setValue('days_disability', days);
    }

    setValue('end_date', date);
  };

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="p-fluid">
      {(formConfig?.fieldsConfig?.user_id ? formConfig.fieldsConfig.user_id.visible : true) && (
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
                placeholder="Seleccione un médico"
                filter
                filterBy="label"
                showClear
                emptyMessage="No se encontraron médicos"
                className={classNames({
                  "p-invalid": fieldState.error,
                })}
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
      )}

      <div className="field">
        <label htmlFor="days_disability" className="block mb-2">
          Cantidad de días *
        </label>
        <Controller
          name="days_disability"
          control={control}
          rules={{
            required: "La cantidad de días es requerida"
          }}
          render={({ field, fieldState }) => (
            <InputNumber
              id={field.name}
              value={field.value}
              onChange={(e) => handleDaysChange(e.value ?? 0)}
              inputClassName="w-100"
              className={`w-100 ${classNames({
                "p-invalid": fieldState.error,
              })}`}
            />
          )}
        />
        {getFormErrorMessage("days_disability")}
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
              onChange={(e) => handleEndDateChange(e.value ?? new Date())}
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
    </form>
  );
});
