import React, { useEffect } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';

export interface TicketReasonFormInputs {
  id?: number;
  key: string;
  label: string;
  tag: string;
  is_active: boolean;
}

interface TicketReasonFormProps {
  formId: string;
  onHandleSubmit: (data: TicketReasonFormInputs) => void;
  initialData?: TicketReasonFormInputs;
}

export const TicketReasonForm: React.FC<TicketReasonFormProps> = ({ formId, onHandleSubmit, initialData }) => {
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<TicketReasonFormInputs>({
    defaultValues: {
      key: '',
      label: '',
      tag: '',
      is_active: true,
    }
  });

  useEffect(() => {
    reset(initialData ?? { key: '', label: '', tag: '', is_active: true });
  }, [initialData, reset]);

  const onSubmit: SubmitHandler<TicketReasonFormInputs> = (data) => {
    onHandleSubmit(data);
  };

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="container-fluid p-3">
      <div className="form-group mb-3">
        <label htmlFor="key">Key</label>
        <InputText id="key" {...register('key', { required: 'Key es requerido' })} className={`form-control ${errors.key ? 'is-invalid' : ''}`} />
        {errors.key && <div className="invalid-feedback">{errors.key.message}</div>}
      </div>
      <div className="form-group mb-3">
        <label htmlFor="label">Label</label>
        <InputText id="label" {...register('label', { required: 'Label es requerido' })} className={`form-control ${errors.label ? 'is-invalid' : ''}`} />
        {errors.label && <div className="invalid-feedback">{errors.label.message}</div>}
      </div>
      <div className="form-group mb-3">
        <label htmlFor="tag">Tagg</label>
        <InputText id="tag" {...register('tag', { required: 'Tag es requerido' })} className={`form-control ${errors.tag ? 'is-invalid' : ''}`} />
        {errors.tag && <div className="invalid-feedback">{errors.tag.message}</div>}
      </div>
      <div className="form-check mb-3">
        <Controller
          name="is_active"
          control={control}
          render={({ field }) => (
            <Checkbox inputId="is_active" checked={field.value} onChange={(e) => field.onChange(e.checked)} />
          )}
        />
        <label htmlFor="is_active" className="form-check-label ms-2">Activo</label>
      </div>
    </form>
  );
};
