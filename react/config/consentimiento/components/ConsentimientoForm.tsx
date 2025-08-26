import React from "react";
import { Controller, useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { useGetTemplates } from "../hooks/useGetTemplates";

interface ConsentimientoFormInputs {
  title?: string;
  data?: string;
  template_type_id?: number;
  description?: string;
  name_patient?: string;
  document?: string;
  name_doctor?: string;
  age?: number;
  date_current?: Date;
  date_birth?: Date;
  phone?: string;
  email?: string;
  city?: string;
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
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ConsentimientoFormInputs>({
    defaultValues: initialData || { 
      title: "",
      data: "",
      template_type_id: 0,
      description: "",
      name_patient: "",
      document: "",
      name_doctor: "",
      age: undefined,
      date_current: new Date(),
      date_birth: undefined,
      phone: "",
      email: "",
      city: ""
    },
  });

  React.useEffect(() => {
    reset(initialData || { 
      title: "",
      data: "",
      template_type_id: 0,
      description: "",
      name_patient: "",
      document: "",
      name_doctor: "",
      age: undefined,
      date_current: new Date(),
      date_birth: undefined,
      phone: "",
      email: "",
      city: ""
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

  return (
    <div className="card mt-4">
      <div className="card-body">
        <h5 className="card-title">Datos del consentimiento</h5>
        <form className="row g-3" onSubmit={handleSubmit(onSubmit)}>
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
              name="data"
              control={control}
              rules={{
                required: "Los datos son requeridos",
                minLength: {
                  value: 3,
                  message: "Los datos deben tener al menos 3 caracteres",
                },
                maxLength: {
                  value: 500,
                  message: "Los datos no pueden exceder 500 caracteres",
                },
              }}
              render={({ field, fieldState }) => (
                <div className="mb-3">
                  <label className="form-label" htmlFor={field.name}>
                    Datos *
                  </label>
                  <InputTextarea
                    className={`w-100 ${fieldState.error ? 'p-invalid' : ''}`}
                    id={field.name}
                    placeholder="Contenido del consentimiento"
                    rows={4}
                    {...field}
                  />
                  {getFormErrorMessage("data")}
                </div>
              )}
            />
          </div>

          <div className="col-md-6">
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

          <div className="col-md-6">
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

          {/* Sección de datos del paciente */}
          <div className="col-12 mt-4">
            <h6 className="text-primary border-bottom pb-2">Datos del Paciente</h6>
          </div>

          <div className="col-md-6">
            <Controller
              name="name_patient"
              control={control}
              rules={{
                required: "El nombre del paciente es requerido",
                minLength: {
                  value: 2,
                  message: "El nombre debe tener al menos 2 caracteres",
                },
                maxLength: {
                  value: 100,
                  message: "El nombre no puede exceder 100 caracteres",
                },
              }}
              render={({ field, fieldState }) => (
                <div className="mb-3">
                  <label className="form-label" htmlFor={field.name}>
                    Nombre del Paciente *
                  </label>
                  <InputText
                    className={`w-100 ${fieldState.error ? 'p-invalid' : ''}`}
                    id={field.name}
                    placeholder="Nombre completo del paciente"
                    {...field}
                  />
                  {getFormErrorMessage("name_patient")}
                </div>
              )}
            />
          </div>

          <div className="col-md-6">
            <Controller
              name="document"
              control={control}
              rules={{
                required: "El documento es requerido",
                pattern: {
                  value: /^[0-9]+$/,
                  message: "El documento debe contener solo números",
                },
                minLength: {
                  value: 6,
                  message: "El documento debe tener al menos 6 dígitos",
                },
                maxLength: {
                  value: 15,
                  message: "El documento no puede exceder 15 dígitos",
                },
              }}
              render={({ field, fieldState }) => (
                <div className="mb-3">
                  <label className="form-label" htmlFor={field.name}>
                    Documento *
                  </label>
                  <InputText
                    className={`w-100 ${fieldState.error ? 'p-invalid' : ''}`}
                    id={field.name}
                    placeholder="Número de documento"
                    {...field}
                  />
                  {getFormErrorMessage("document")}
                </div>
              )}
            />
          </div>

          <div className="col-md-4">
            <Controller
              name="age"
              control={control}
              rules={{
                required: "La edad es requerida",
                min: {
                  value: 0,
                  message: "La edad no puede ser negativa",
                },
                max: {
                  value: 150,
                  message: "La edad no puede exceder 150 años",
                },
              }}
              render={({ field, fieldState }) => (
                <div className="mb-3">
                  <label className="form-label" htmlFor={field.name}>
                    Edad *
                  </label>
                  <InputText
                    className={`w-100 ${fieldState.error ? 'p-invalid' : ''}`}
                    id={field.name}
                    placeholder="Edad en años"
                    type="number"
                    min="0"
                    max="150"
                    value={field.value?.toString() || ''}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                  />
                  {getFormErrorMessage("age")}
                </div>
              )}
            />
          </div>

          <div className="col-md-4">
            <Controller
              name="date_birth"
              control={control}
              rules={{
                required: "La fecha de nacimiento es requerida",
              }}
              render={({ field, fieldState }) => (
                <div className="mb-3">
                  <label className="form-label" htmlFor={field.name}>
                    Fecha de Nacimiento *
                  </label>
                  <Calendar
                    className={`w-100 ${fieldState.error ? 'p-invalid' : ''}`}
                    id={field.name}
                    placeholder="Seleccione fecha de nacimiento"
                    dateFormat="dd/mm/yy"
                    showIcon
                    maxDate={new Date()}
                    yearNavigator
                    yearRange="1900:2024"
                    value={field.value}
                    onChange={(e) => field.onChange(e.value)}
                  />
                  {getFormErrorMessage("date_birth")}
                </div>
              )}
            />
          </div>

          <div className="col-md-4">
            <Controller
              name="date_current"
              control={control}
              rules={{
                required: "La fecha actual es requerida",
              }}
              render={({ field, fieldState }) => (
                <div className="mb-3">
                  <label className="form-label" htmlFor={field.name}>
                    Fecha Actual *
                  </label>
                  <Calendar
                    className={`w-100 ${fieldState.error ? 'p-invalid' : ''}`}
                    id={field.name}
                    placeholder="Fecha actual"
                    dateFormat="dd/mm/yy"
                    showIcon
                    value={field.value}
                    onChange={(e) => field.onChange(e.value)}
                  />
                  {getFormErrorMessage("date_current")}
                </div>
              )}
            />
          </div>

          <div className="col-md-6">
            <Controller
              name="phone"
              control={control}
              rules={{
                required: "El teléfono es requerido",
                pattern: {
                  value: /^[+]?[0-9\s\-()]{7,15}$/,
                  message: "Formato de teléfono inválido",
                },
              }}
              render={({ field, fieldState }) => (
                <div className="mb-3">
                  <label className="form-label" htmlFor={field.name}>
                    Teléfono *
                  </label>
                  <InputText
                    className={`w-100 ${fieldState.error ? 'p-invalid' : ''}`}
                    id={field.name}
                    placeholder="Número de teléfono"
                    {...field}
                  />
                  {getFormErrorMessage("phone")}
                </div>
              )}
            />
          </div>

          <div className="col-md-6">
            <Controller
              name="email"
              control={control}
              rules={{
                required: "El email es requerido",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Formato de email inválido",
                },
              }}
              render={({ field, fieldState }) => (
                <div className="mb-3">
                  <label className="form-label" htmlFor={field.name}>
                    Email *
                  </label>
                  <InputText
                    className={`w-100 ${fieldState.error ? 'p-invalid' : ''}`}
                    id={field.name}
                    placeholder="Correo electrónico"
                    type="email"
                    {...field}
                  />
                  {getFormErrorMessage("email")}
                </div>
              )}
            />
          </div>

          <div className="col-md-6">
            <Controller
              name="city"
              control={control}
              rules={{
                required: "La ciudad es requerida",
                minLength: {
                  value: 2,
                  message: "La ciudad debe tener al menos 2 caracteres",
                },
                maxLength: {
                  value: 50,
                  message: "La ciudad no puede exceder 50 caracteres",
                },
              }}
              render={({ field, fieldState }) => (
                <div className="mb-3">
                  <label className="form-label" htmlFor={field.name}>
                    Ciudad *
                  </label>
                  <InputText
                    className={`w-100 ${fieldState.error ? 'p-invalid' : ''}`}
                    id={field.name}
                    placeholder="Ciudad de residencia"
                    {...field}
                  />
                  {getFormErrorMessage("city")}
                </div>
              )}
            />
          </div>

          <div className="col-md-6">
            <Controller
              name="name_doctor"
              control={control}
              rules={{
                required: "El nombre del doctor es requerido",
                minLength: {
                  value: 2,
                  message: "El nombre debe tener al menos 2 caracteres",
                },
                maxLength: {
                  value: 100,
                  message: "El nombre no puede exceder 100 caracteres",
                },
              }}
              render={({ field, fieldState }) => (
                <div className="mb-3">
                  <label className="form-label" htmlFor={field.name}>
                    Nombre del Doctor *
                  </label>
                  <InputText
                    className={`w-100 ${fieldState.error ? 'p-invalid' : ''}`}
                    id={field.name}
                    placeholder="Nombre completo del doctor"
                    {...field}
                  />
                  {getFormErrorMessage("name_doctor")}
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
      </div>
    </div>
  );
};
