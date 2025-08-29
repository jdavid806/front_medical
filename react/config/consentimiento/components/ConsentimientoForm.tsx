import React from "react";
import { Controller, useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { useGetTemplates } from "../hooks/useGetTemplates";
import { Editor } from 'primereact/editor';

const quillTextOptions = [
  {
    label: 'Nombre Paciente',
    value: '{{NOMBRE_PACIENTE}}'
  },
  {
    label: 'Documento',
    value: '{{DOCUMENTO}}'
  },
  {
    label: 'Nombre Doctor',
    value: '{{NOMBRE_DOCTOR}}'
  },
  {
    label: 'Edad',
    value: '{{EDAD}}'
  },
  {
    label: 'Fecha Actual',
    value: '{{FECHA_ACTUAL}}'
  },
  {
    label: 'Fecha Nacimiento',
    value: '{{FECHA_NACIMIENTO}}'
  },
  {
    label: 'Telefono',
    value: '{{TELEFONO}}'
  },
  {
    label: 'Correo Electrónico',
    value: '{{EMAIL}}'
  },
  {
    label: 'Ciudad',
    value: '{{CIUDAD}}'
  }
]

interface ConsentimientoFormInputs {
  title?: string;
  data?: string;
  template_type_id?: number;
  description?: string;
}

interface ConsentimientoFormProps {
  onHandleSubmit: (data: ConsentimientoFormInputs) => void;
  initialData?: ConsentimientoFormInputs;
}

export const ConsentimientoForm: React.FC<ConsentimientoFormProps> = ({
  onHandleSubmit,
  initialData,
}) => {
  // Use the hook directly to get templates
  const { templates, loading: templatesLoading } = useGetTemplates();

  console.log('templates', templates)

  const {
    control,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ConsentimientoFormInputs>({
    defaultValues: initialData || { 
      title: "",
      data: "",
      template_type_id: 0,
      description: ""
    },
  });

  React.useEffect(() => {
    reset(initialData || { 
      title: "",
      data: "",
      template_type_id: 0,
      description: "",
    });
  }, [initialData, reset]);

  const onSubmit = (data: ConsentimientoFormInputs) => {
    onHandleSubmit(data);
  };

  const getFormErrorMessage = (name: keyof ConsentimientoFormInputs) => {
    return (
      errors[name] && <small className="text-danger">{errors[name]?.message}</small>
    );
  };

  // Transform templates data for dropdown options
  const templateOptions = templates.map(template => ({
    label: template.name,
    value: template.id
  }));

  const setQuillEditor = ($quill: string) => {
    const quillValue = getValues('data') || '';
    const cleanValue = quillValue.replace(/<\/p>$/, '').replace(/<br\s*\/?>$/, '');
    const newValue = cleanValue + $quill;
    setValue('data', newValue);
  }

  return (
    <form className="row" onSubmit={handleSubmit(onSubmit)}>
      <div className="col-12">
        <Controller
          name="title"
          control={control}
          rules={{
            required: "El título es requerido",
            minLength: {
              value: 3,
              message: "El título debe tener al menos 3 caracteres",
            },
            maxLength: {
              value: 100,
              message: "El título no puede exceder 100 caracteres",
            },
          }}
          render={({ field, fieldState }) => (
            <div className="mb-3">
              <label className="form-label" htmlFor={field.name}>
                Título *
              </label>
              <InputText
                className={`w-100 ${fieldState.error ? 'p-invalid' : ''}`}
                id={field.name}
                placeholder="Título del consentimiento"
                {...field}
              />
              {getFormErrorMessage("title")}
            </div>
          )}
        />
      </div>


      <div className="col-12">
        <Controller
          name="template_type_id"
          control={control}
          rules={{
            required: "El tipo de plantilla es requerido",
            min: {
              value: 1,
              message: "Debe seleccionar un tipo de plantilla",
            },
          }}
          render={({ field, fieldState }) => (
            <div className="mb-3">
              <label className="form-label" htmlFor={field.name}>
                Tipo de Plantilla *
              </label>
              <Dropdown
                className={`w-100 ${fieldState.error ? 'p-invalid' : ''}`}
                id={field.name}
                placeholder={templatesLoading ? "Cargando..." : "Seleccione un tipo de plantilla"}
                value={field.value}
                options={templateOptions}
                onChange={(e) => field.onChange(e.value)}
                optionLabel="label"
                optionValue="value"
                showClear
                disabled={templatesLoading}
              />
              {getFormErrorMessage("template_type_id")}
            </div>
          )}
        />
      </div>
      <div className="col-12">
        <Controller
          name="description"
          control={control}
          render={({ field, fieldState }) => (
            <div className="mb-3">
              <label className="form-label" htmlFor={field.name}>
                Descripción
              </label>
              <InputTextarea
                className={`w-100 ${fieldState.error ? 'p-invalid' : ''}`}
                id={field.name}
                placeholder="Descripción adicional (opcional)"
                rows={3}
                {...field}
              />
              {getFormErrorMessage("description")}
            </div>
          )}
        />
      </div>
      <div className="col-12">
        <div className="d-flex flex-wrap gap-2">
          {quillTextOptions.map((option) => (
            <label
              onClick={() => setQuillEditor(option.value)}
              className="form-label text-primary border border-primary rounded-pill"
              key={option.value}
              style={{ padding: '8px 12px', backgroundColor: 'rgba(13, 110, 253, 0.2)' }}>
              {option.label}
            </label>
          ))}
        </div>
        <Controller
          name="data"
          control={control}
          rules={{
            required: "Los datos son requeridos",
            minLength: {
              value: 3,
              message: "Los datos deben tener al menos 3 caracteres",
            }
          }}
          render={({ field, fieldState }) => (
            <div className="mb-3">
              <label className="form-label" htmlFor={field.name}>
                Datos *
              </label>
              <Editor
                className={`w-100 ${fieldState.error ? 'p-invalid' : ''}`}
                id={field.name}
                placeholder="Contenido del consentimiento"
                style={{ height: '200px' }}
                onTextChange={(e) => field.onChange(e.htmlValue || '')}
                {...field}
              />
              {getFormErrorMessage("data")}
            </div>
          )}
        />
      </div>



      <div className="col-12 text-end mt-4">
        <button className="btn btn-primary me-2" type="submit">
          Guardar
        </button>
        <button 
          className="btn btn-outline-primary" 
          type="button"
          onClick={() => reset()}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};
