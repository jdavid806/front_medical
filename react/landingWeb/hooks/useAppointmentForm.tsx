import { useMemo, useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useAvailableSpecialties } from "../hooks/useAvailableSpecialties";
import { useProductsByType } from "../../products/hooks/useProductsByType";
import { useLandingAvailabilities } from "../hooks/useLandingAvailabilities";

// Lógica relacionada con el formulario de citas
export const useAppointmentForm = (patient?: any, onSave?: (data: any) => void) => {
  const { control, handleSubmit } = useForm();
  const { data: availabilities } = useLandingAvailabilities();
  const { specialties: allUserSpecialties, loading: loadingSpecialties } = useAvailableSpecialties();
  const { productsByType, fetchProductsByType, loading: loadingProcedures } = useProductsByType();

  const allowedSpecialtyIds = useMemo(() => {
    if (!availabilities?.length) return [];
    return [...new Set(availabilities.flatMap((a: any) => a.specialties))];
  }, [availabilities]);

  const userSpecialties = useMemo(() => {
    if (!Array.isArray(allUserSpecialties)) return [];
    if (!allowedSpecialtyIds?.length) return allUserSpecialties;
    return allUserSpecialties.filter((s: any) => allowedSpecialtyIds.includes(s.id));
  }, [allUserSpecialties, allowedSpecialtyIds]);

  const [selectedSpecialty, setSelectedSpecialty] = useState<number | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);

  // Cargar procedimientos solo una vez
  const loadedRef = useRef(false);
  useEffect(() => {
    if (!loadedRef.current) {
      loadedRef.current = true;
      fetchProductsByType("Servicios");
    }
  }, [fetchProductsByType]);

  // Opciones derivadas
  const specialtyOptions = useMemo(
    () =>
      (userSpecialties || []).map((s: any) => ({
        label: s.name,
        value: s.id,
        doctors: Array.isArray(s.users) ? s.users : [],
      })),
    [userSpecialties]
  );

  const doctorOptions = useMemo(() => {
    const selected = specialtyOptions.find((s) => s.value === selectedSpecialty);
    if (!selected) return [];
    return selected.doctors.map((d: any) => ({
      label: `${d.first_name ?? ""} ${d.last_name ?? ""}`.trim(),
      value: d.id,
    }));
  }, [selectedSpecialty, specialtyOptions]);

  const procedureOptions = useMemo(
    () =>
      (productsByType || []).map((p: any) => ({
        label: p.label || p.name,
        value: p.id,
      })),
    [productsByType]
  );

  // 👇 Consolas para depurar el flujo de especialidades/doctores
  useEffect(() => {
  }, [specialtyOptions, doctorOptions, selectedSpecialty]);

  const onSubmit = (data: any) => {
    if (onSave) onSave({ ...data, patient });
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
  };
};
