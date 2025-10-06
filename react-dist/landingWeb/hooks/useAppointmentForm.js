import { useMemo, useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useAvailableSpecialties } from "../hooks/useAvailableSpecialties.js";
import { useProductsByType } from "../../products/hooks/useProductsByType.js";
import { useLandingAvailabilities } from "../hooks/useLandingAvailabilities.js";
import { useAppointmentBulkCreate } from "../../appointments/hooks/useAppointmentBulkCreate.js";
export const useAppointmentForm = (patient, onSave) => {
  const {
    control,
    handleSubmit
  } = useForm();
  const {
    data: availabilities
  } = useLandingAvailabilities();
  const {
    specialties: allUserSpecialties,
    loading: loadingSpecialties
  } = useAvailableSpecialties();
  const {
    productsByType,
    fetchProductsByType,
    loading: loadingProcedures
  } = useProductsByType();
  const {
    loading: creating,
    createAppointmentBulk
  } = useAppointmentBulkCreate();
  const allowedSpecialtyIds = useMemo(() => {
    if (!availabilities?.length) return [];
    return [...new Set(availabilities.flatMap(a => a.specialties))];
  }, [availabilities]);
  const userSpecialties = useMemo(() => {
    if (!Array.isArray(allUserSpecialties)) return [];
    if (!allowedSpecialtyIds?.length) return allUserSpecialties;
    return allUserSpecialties.filter(s => allowedSpecialtyIds.includes(s.id));
  }, [allUserSpecialties, allowedSpecialtyIds]);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const loadedRef = useRef(false);
  useEffect(() => {
    if (!loadedRef.current) {
      loadedRef.current = true;
      fetchProductsByType("Servicios");
    }
  }, [fetchProductsByType]);
  const specialtyOptions = useMemo(() => (userSpecialties || []).map(s => ({
    label: s.name,
    value: s.id,
    doctors: Array.isArray(s.users) ? s.users : []
  })), [userSpecialties]);
  const doctorOptions = useMemo(() => {
    const selected = specialtyOptions.find(s => s.value === selectedSpecialty);
    if (!selected) return [];
    return selected.doctors.map(d => ({
      label: `${d.first_name ?? ""} ${d.last_name ?? ""}`.trim(),
      value: d.id
    }));
  }, [selectedSpecialty, specialtyOptions]);
  const procedureOptions = useMemo(() => (productsByType || []).map(p => ({
    label: p.label || p.name,
    value: p.id
  })), [productsByType]);

  // 🚀 GUARDAR CITA
  const onSubmit = async data => {
    try {
      const payload = {
        appointments: [{
          appointment_date: data.appointment_date ? new Date(data.appointment_date).toISOString().split("T")[0] : null,
          appointment_time: data.appointment_time ? new Date(data.appointment_time).toTimeString().split(" ")[0] : null,
          assigned_user_availability_id: selectedDoctor,
          product_id: data.product_id,
          created_by_user_id: 1,
          // o el user logueado
          appointment_state_id: 1,
          attention_type: "CONSULTATION",
          consultation_purpose: "TREATMENT",
          consultation_type: "FOLLOW_UP",
          external_cause: "NOT_APPLICABLE",
          assigned_supervisor_user_availability_id: null,
          exam_recipe_id: null
        }]
      };
      console.log("Payload a enviar:", payload);
      if (!patient?.id) {
        alert("Debe seleccionar un paciente");
        return;
      }
      await createAppointmentBulk(payload, patient.id);
      if (onSave) onSave(data);
    } catch (error) {
      console.error("Error creando la cita:", error);
    }
  };
  return {
    control,
    handleSubmit,
    loadingSpecialties,
    loadingProcedures,
    specialtyOptions,
    doctorOptions,
    procedureOptions,
    selectedSpecialty,
    selectedDoctor,
    setSelectedSpecialty,
    setSelectedDoctor,
    onSubmit,
    creating
  };
};