import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Controller, useForm } from 'react-hook-form';
import { classNames } from 'primereact/utils';

interface Companion {
  first_name: string;
  last_name: string;
  relationship: string;
  document_number: string;
  mobile: string;
  email?: string;
}

interface CompanionModalProps {
  visible: boolean;
  onHide: () => void;
  onSave: (companion: Companion) => void;
}

const relationOptions = [
  { label: "Padre", value: "Padre" },
  { label: "Madre", value: "Madre" },
  { label: "Hermano (a)", value: "Hermano (a)" },
  { label: "Tio (a)", value: "Tio (a)" },
  { label: "Abuelo (a)", value: "Abuelo (a)" },
  { label: "Primo (a)", value: "Primo (a)" },
  { label: "Amigo (a)", value: "Amigo (a)" },
  { label: "Esposo (a)", value: "Esposo (a)" },
  { label: "Otro", value: "Otro" }
];

const CompanionModal: React.FC<CompanionModalProps> = ({ visible, onHide, onSave }) => {
  const { control, handleSubmit, reset } = useForm<Companion>({
    defaultValues: {
      first_name: '',
      last_name: '',
      relationship: '',
      document_number: '',
      mobile: '',
      email: ''
    }
  });

  const onSubmit = (data: Companion) => {
    onSave(data);
    reset();
    onHide();
  };

  return (
    <Dialog 
      header="Nuevo acompañante" 
      visible={visible} 
      onHide={onHide} 
      style={{ width: '50vw' }}
      appendTo={"self"}
      breakpoints={{ '960px': '75vw', '640px': '90vw' }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
        <div className="grid">
          <div className="field col-12 md:col-6">
            <Controller
              name="first_name"
              control={control}
              rules={{ required: 'Primer nombre es requerido' }}
              render={({ field, fieldState }) => (
                <div className="mb-3">
                  <label htmlFor={field.name} className="block mb-2">
                    Primer Nombre *
                  </label>
                  <InputText
                    id={field.name}
                    className={classNames('w-full', { 'p-invalid': fieldState.error })}
                    {...field}
                  />
                  {fieldState.error && <small className="p-error">{fieldState.error.message}</small>}
                </div>
              )}
            />
          </div>
          
          <div className="field col-12 md:col-6">
            <Controller
              name="last_name"
              control={control}
              rules={{ required: 'Primer apellido es requerido' }}
              render={({ field, fieldState }) => (
                <div className="mb-3">
                  <label htmlFor={field.name} className="block mb-2">
                    Primer Apellido *
                  </label>
                  <InputText
                    id={field.name}
                    className={classNames('w-full', { 'p-invalid': fieldState.error })}
                    {...field}
                  />
                  {fieldState.error && <small className="p-error">{fieldState.error.message}</small>}
                </div>
              )}
            />
          </div>
          
          <div className="field col-12 md:col-6">
            <Controller
              name="relationship"
              control={control}
              rules={{ required: 'Parentesco es requerido' }}
              render={({ field, fieldState }) => (
                <div className="mb-3">
                  <label htmlFor={field.name} className="block mb-2">
                    Parentesco *
                  </label>
                  <Dropdown
                    id={field.name}
                    options={relationOptions}
                    placeholder="Seleccione parentesco"
                    className={classNames('w-full', { 'p-invalid': fieldState.error })}
                    value={field.value}
                    onChange={(e) => field.onChange(e.value)}
                  />
                  {fieldState.error && <small className="p-error">{fieldState.error.message}</small>}
                </div>
              )}
            />
          </div>
          
          <div className="field col-12 md:col-6">
            <Controller
              name="document_number"
              control={control}
              rules={{ required: 'Número de documento es requerido' }}
              render={({ field, fieldState }) => (
                <div className="mb-3">
                  <label htmlFor={field.name} className="block mb-2">
                    Número de identificación *
                  </label>
                  <InputText
                    id={field.name}
                    className={classNames('w-full', { 'p-invalid': fieldState.error })}
                    {...field}
                  />
                  {fieldState.error && <small className="p-error">{fieldState.error.message}</small>}
                </div>
              )}
            />
          </div>
          
          <div className="field col-12 md:col-6">
            <Controller
              name="mobile"
              control={control}
              rules={{ required: 'WhatsApp es requerido' }}
              render={({ field, fieldState }) => (
                <div className="mb-3">
                  <label htmlFor={field.name} className="block mb-2">
                    WhatsApp *
                  </label>
                  <InputText
                    id={field.name}
                    className={classNames('w-full', { 'p-invalid': fieldState.error })}
                    {...field}
                  />
                  {fieldState.error && <small className="p-error">{fieldState.error.message}</small>}
                </div>
              )}
            />
          </div>
          
          <div className="field col-12 md:col-6">
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <div className="mb-3">
                  <label htmlFor={field.name} className="block mb-2">
                    Correo electrónico
                  </label>
                  <InputText
                    id={field.name}
                    className="w-full"
                    {...field}
                  />
                </div>
              )}
            />
          </div>
        </div>
        
        <div className="flex justify-content-end gap-2 mt-4">
          <Button 
            label="Cancelar" 
            className="p-button-text" 
            onClick={onHide} 
          />
          <Button 
            label="Guardar" 
            type="submit" 
          />
        </div>
      </form>
    </Dialog>
  );
};

export default CompanionModal;