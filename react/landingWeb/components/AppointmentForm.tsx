import React, { useMemo, useState, useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { AutoComplete } from "primereact/autocomplete";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { RadioButton } from "primereact/radiobutton";
import { Card } from "primereact/card";
import { useAvailableSpecialties } from "../hooks/useAvailableSpecialties";
import { useProductsByType } from "../../products/hooks/useProductsByType";
import { useLandingAvailabilities } from "../hooks/useLandingAvailabilities";
import { useValidateBulkAppointments } from "../../appointments/hooks/useValidateBulkAppointments";


interface AppointmentFormProps {
  patient?: any;
  onSave?: (data: any) => void;
  onCancel?: () => void;
}

export const AppointmentForm: React.FC<AppointmentFormProps> = ({
  patient,
  onSave,
  onCancel,
}) => {
  const { control, handleSubmit } = useForm();

  const { data: availabilities } = useLandingAvailabilities();

  const allowedSpecialtyIds = useMemo(() => {
    if (!availabilities?.length) return [];
    return [...new Set(availabilities.flatMap((a: any) => a.specialties))];
  }, [availabilities]);

  const { specialties: allUserSpecialties, loading: loadingSpecialties } =
    useAvailableSpecialties();

  const userSpecialties = useMemo(() => {
    if (!Array.isArray(allUserSpecialties)) return [];
    if (!allowedSpecialtyIds?.length) return allUserSpecialties; // si no hay filtro, mostramos todas
    return allUserSpecialties.filter((s: any) =>
      allowedSpecialtyIds.includes(s.id)
    );
  }, [allUserSpecialties, allowedSpecialtyIds]);

  // 🔹 5. Productos tipo "Servicios"
  const {
    productsByType,
    fetchProductsByType,
    loading: loadingProcedures,
  } = useProductsByType();

  const [selectedSpecialty, setSelectedSpecialty] = useState<number | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);

  const loadedRef = useRef(false);
  useEffect(() => {
    if (!loadedRef.current) {
      loadedRef.current = true;
      fetchProductsByType("Servicios");
    }
  }, [fetchProductsByType]);

  // 🔹 Mapear especialidades
  const specialtyOptions = useMemo(() => {
    if (!Array.isArray(userSpecialties)) return [];
    return userSpecialties.map((s: any) => ({
      label: s.name,
      value: s.id,
      doctors: Array.isArray(s.users) ? s.users : [], // si no trae users, queda []
    }));
  }, [userSpecialties]);

  // 🔹 Mapear doctores según la especialidad
  const doctorOptions = useMemo(() => {
    const selected = specialtyOptions.find((s) => s.value === selectedSpecialty);
    if (!selected) return [];
    return selected.doctors.map((d: any) => ({
      label: `${d.first_name ?? ""} ${d.last_name ?? ""}`.trim(),
      value: d.id,
    }));
  }, [selectedSpecialty, specialtyOptions]);

  // 🔹 Mapear procedimientos
  const procedureOptions = useMemo(() => {
    if (!Array.isArray(productsByType)) return [];
    return productsByType.map((p: any) => ({
      label: p.label || p.name,
      value: p.id,
    }));
  }, [productsByType]);

  const onSubmit = (data: any) => {
    if (onSave) onSave({ ...data, patient });
  };

  // ✅ Render
  return (
    <form className="needs-validation row" noValidate onSubmit={handleSubmit(onSubmit)}>
      {/* Paciente */}
      <div className="col-12">
        <div className="mb-3">
          <label className="form-label">Paciente *</label>
          <div className="d-flex">
            <Controller
              name="patient"
              control={control}
              render={({ field }) => (
                <AutoComplete
                  {...field}
                  placeholder="Seleccione un paciente"
                  field="label"
                  inputClassName="w-100"
                  className="w-100"
                  appendTo="self"
                />
              )}
            />
            <button type="button" className="btn btn-primary ms-2">
              <i className="fas fa-plus"></i>
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Whatsapp *</label>
            <Controller
              name="patient_whatsapp"
              control={control}
              render={({ field }) => <InputText {...field} className="w-100" />}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Email</label>
            <Controller
              name="patient_email"
              control={control}
              render={({ field }) => <InputText {...field} className="w-100" />}
            />
          </div>
        </div>
      </div>

      {/* Contenedor principal */}
      <div className="col-12 px-3 mb-3">
        <Card>
          <div className="row">
            <div className="col-md-7">
              {/* Especialidad */}
              <div className="mb-3">
                <label className="form-label">Especialidad médica *</label>
                <Controller
                  name="user_specialty"
                  control={control}
                  render={({ field }) => (
                    <Dropdown
                      {...field}
                      className="w-100"
                      placeholder="Seleccione una especialidad"
                      options={specialtyOptions}
                      loading={loadingSpecialties}
                      optionLabel="label"
                      optionValue="value"
                      onChange={(e) => {
                        field.onChange(e.value);
                        setSelectedSpecialty(e.value);
                        setSelectedDoctor(null);
                      }}
                    />
                  )}
                />
              </div>

              {/* Doctor */}
              <div className="mb-3">
                <label className="form-label">Doctor(a) *</label>
                <Controller
                  name="assigned_user"
                  control={control}
                  render={({ field }) => (
                    <Dropdown
                      {...field}
                      className="w-100"
                      placeholder={
                        selectedSpecialty
                          ? "Seleccione un doctor"
                          : "Primero seleccione una especialidad"
                      }
                      options={doctorOptions}
                      optionLabel="label"
                      optionValue="value"
                      disabled={!selectedSpecialty}
                      value={selectedDoctor}
                      onChange={(e) => {
                        field.onChange(e.value);
                        setSelectedDoctor(e.value);
                      }}
                    />
                  )}
                />
              </div>

              {/* Tipo de cita */}
              <div className="mb-3">
                <label className="form-label mb-2">Tipo de cita *</label>
                <div className="d-flex flex-wrap gap-3">
                  <Controller
                    name="appointment_type"
                    control={control}
                    render={({ field }) => (
                      <>
                        <RadioButton
                          inputId="appointmentType1"
                          value="1"
                          onChange={(e) => field.onChange(e.value)}
                          checked={field.value === "1"}
                        />
                        <label htmlFor="appointmentType1" className="form-check-label">
                          Presencial
                        </label>
                      </>
                    )}
                  />
                </div>
              </div>

              {/* Fecha */}
              <div className="mb-3">
                <label className="form-label">Fecha de la consulta *</label>
                <Controller
                  name="appointment_date"
                  control={control}
                  render={({ field }) => (
                    <Calendar {...field} className="w-100" placeholder="Seleccione una fecha" />
                  )}
                />
              </div>

              {/* Hora */}
              <div className="mb-3">
                <label className="form-label">Hora de la consulta *</label>
                <Controller
                  name="appointment_time"
                  control={control}
                  render={({ field }) => (
                    <Dropdown {...field} className="w-100" placeholder="Seleccione una hora" />
                  )}
                />
              </div>

              {/* Procedimiento */}
              <div className="mb-3">
                <label className="form-label">Procedimiento *</label>
                <Controller
                  name="product_id"
                  control={control}
                  render={({ field }) => (
                    <Dropdown
                      {...field}
                      className="w-100"
                      placeholder="Seleccione un procedimiento"
                      options={procedureOptions}
                      loading={loadingProcedures}
                      optionLabel="label"
                      optionValue="value"
                    />
                  )}
                />
              </div>

              {/* Botones */}
              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-link text-danger px-3 my-0"
                  onClick={onCancel}
                >
                  <i className="fas fa-arrow-left"></i> Cerrar
                </button>
                <button type="submit" className="btn btn-primary my-0">
                  <i className="fas fa-bookmark"></i> Guardar
                </button>
              </div>
            </div>

            {/* Columna derecha */}
            <div className="col-md-5">
              <h5>Citas programadas</h5>
              <hr />
              <p className="text-muted">Aquí irá el listado de citas</p>
            </div>
          </div>
        </Card>
      </div>
    </form>
  );
};
