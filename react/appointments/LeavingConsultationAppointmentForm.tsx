import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useState } from "react";
import { classNames } from "primereact/utils";
import { Dropdown } from "primereact/dropdown";
import { UserAvailability } from "../models/models";
import { useEffect } from "react";
import { Calendar } from "primereact/calendar";
import { Nullable } from "primereact/ts-helpers";
import {
    userAvailabilityService,
    userService
} from "../../services/api";
import { stringToDate } from "../../services/utilidades";
import { UserSpecialtyDto } from "../models/models";
import { useUserSpecialties } from "../user-specialties/hooks/useUserSpecialties";
import { generarFormato } from "../../funciones/funcionesJS/generarPDF";

interface AppointmentFormInputs {
    user_specialty: UserSpecialtyDto | null;
    appointment_date: Nullable<Date>;
    appointment_time: string | null;
    assigned_user_availability: UserAvailability | null;
    assigned_user_assistant_availability_id: string | null;
}

interface LeavingConsultationAppointmentFormProps {
    patientId: string;
    userSpecialtyId: string;
    userId?: string;
}

export interface LeavingConsultationAppointmentFormRef {
    mapAppointmentToServer: () => Promise<any>;
}

export const LeavingConsultationAppointmentForm = forwardRef(({ patientId, userSpecialtyId, userId }: LeavingConsultationAppointmentFormProps, ref) => {

    const [appointmentDateDisabled, setAppointmentDateDisabled] = useState(true);
    const [appointmentTimeDisabled, setAppointmentTimeDisabled] = useState(true);
    const [userAvailabilityDisabled, setUserAvailabilityDisabled] =
        useState(true);

    const [appointmentTimeOptions, setAppointmentTimeOptions] = useState<any[]>(
        []
    );
    const [userAvailabilityOptions, setUserAvailabilityOptions] = useState<any[]>(
        []
    );
    const [assistantAvailabilityOptions, setAssistantAvailabilityOptions] =
        useState<any[]>([]);

    const [availableBlocks, setAvailableBlocks] = useState<any[]>([]);
    const [enabledDates, setEnabledDates] = useState<Date[]>([]);

    const [showUserSpecialtyError, setShowUserSpecialtyError] = useState(false);
    const [userSpecialtyError, setUserSpecialtyError] = useState("");

    const { userSpecialties } = useUserSpecialties();

    useImperativeHandle(ref, () => ({
        mapAppointmentToServer: () => mapAppointmentToServer(),
    }));

    const {
        control,
        setValue,
        formState: { errors, isValid },
    } = useForm<AppointmentFormInputs>({
        defaultValues: {
            user_specialty: null,
            appointment_date: null,
            appointment_time: "",
            assigned_user_availability: null,
            assigned_user_assistant_availability_id: null,
        },
    });

    const mapAppointmentToServer = async () => {
        const currentUser = await userService.getLoggedUser();

        const assignedUserAvailabilityId =
            assignedUserAssistantAvailabilityId ||
            assignedUserAvailability?.id;
        const supervisorUserId = assignedUserAssistantAvailabilityId
            ? assignedUserAvailability?.id
            : null;

        const data = {
            appointment_date: appointmentDate?.toISOString().split("T")[0],
            appointment_time: appointmentTime + ":00",
            assigned_user_availability_id: assignedUserAvailabilityId,
            created_by_user_id: currentUser?.id,
            assigned_supervisor_user_availability_id: supervisorUserId
        };

        console.log(data);

        return data;
    };

    const userSpecialty = useWatch({
        control,
        name: "user_specialty",
    });

    const appointmentDate = useWatch({
        control,
        name: "appointment_date",
    });

    const appointmentTime = useWatch({
        control,
        name: "appointment_time",
    });

    const assignedUserAvailability = useWatch({
        control,
        name: "assigned_user_availability",
    });

    const assignedUserAssistantAvailabilityId = useWatch({
        control,
        name: "assigned_user_assistant_availability_id",
    })

    useEffect(() => {

        if (userSpecialtyId && userSpecialties.length > 0) {

            const userSpecialty = userSpecialties.find(
                (userSpecialty) => userSpecialty.id == userSpecialtyId
            )

            setValue('user_specialty', userSpecialty || null);
        }
    }, [userSpecialties, userSpecialtyId]);

    useEffect(() => {

        if (!userSpecialty) {
            setShowUserSpecialtyError(false);
            setAppointmentDateDisabled(true);
            setAppointmentTimeDisabled(true);
            setUserAvailabilityDisabled(true);
            setValue("appointment_date", null);
            setValue("appointment_time", "");
            setValue("assigned_user_availability", null);
            return;
        }

        setShowUserSpecialtyError(false);
        setValue("appointment_date", null);
        setAppointmentTimeOptions([]);

        const asyncScope = async () => {
            const availableBlocks: any[] =
                await userAvailabilityService.availableBlocks({
                    user_specialty_id: userSpecialty?.id,
                } as any);

            setAvailableBlocks(availableBlocks);

            if (availableBlocks.length > 0) {
                setAppointmentDateDisabled(false);
                setAppointmentTimeDisabled(false);
                setUserAvailabilityDisabled(false);
            } else {
                setShowUserSpecialtyError(true);
                setUserSpecialtyError(userSpecialty?.label || "");
            }

            setEnabledDates([]);

            let availableDates: Date[] = [];

            availableBlocks.forEach((item) => {
                item.days.forEach((day) => {
                    if (!enabledDates.includes(day.date)) {
                        availableDates.push(stringToDate(day.date));
                    }
                });
            });

            setEnabledDates(availableDates);

            updateAppointmentTimeOptions(availableBlocks, availableDates[0]);
        };
        asyncScope();
    }, [userSpecialty]);

    useEffect(() => {
        if (appointmentDate) {
            updateAppointmentTimeOptions(availableBlocks, appointmentDate);
        }
    }, [appointmentDate]);

    useEffect(() => {
        if (assignedUserAvailability) {
            // Cargar asistentes para el doctor seleccionado
            loadAssistantsForSelectedDoctor(assignedUserAvailability.id);

            // Actualizar horas si no hay asistente seleccionado
            if (!assignedUserAssistantAvailabilityId && appointmentDate) {
                updateTimeSlotsForProfessional(
                    availableBlocks,
                    appointmentDate.toISOString().split("T")[0],
                    assignedUserAvailability.id
                );
            }
        } else {
            setAssistantAvailabilityOptions([]);
        }
    }, [assignedUserAvailability]);

    useEffect(() => {
        if (assignedUserAssistantAvailabilityId && appointmentDate) {
            updateTimeSlotsForProfessional(
                availableBlocks,
                appointmentDate.toISOString().split("T")[0],
                assignedUserAssistantAvailabilityId
            );
        } else if (assignedUserAvailability && appointmentDate) {
            // Si se deselecciona, volver a horas del doctor
            updateTimeSlotsForProfessional(
                availableBlocks,
                appointmentDate.toISOString().split("T")[0],
                assignedUserAvailability.id
            );
        }
    }, [assignedUserAssistantAvailabilityId]);

    useEffect(() => {
        if (!enabledDates.length) return;
        setValue(
            "appointment_date",
            enabledDates.length > 0
                ? enabledDates.sort((a, b) => a.getTime() - b.getTime())[0]
                : null
        );
    }, [enabledDates]);

    useEffect(() => {
        if (appointmentTimeOptions.length > 0 && appointmentDate) {
            const selectedTime =
                appointmentTimeOptions.length > 0
                    ? appointmentTimeOptions[0].value
                    : null;

            setValue(
                "appointment_time",
                selectedTime || null
            );
        }
    }, [appointmentTimeOptions]);

    const getFormErrorMessage = (name: keyof AppointmentFormInputs) => {
        return (
            errors[name] &&
            errors[name].type !== "required" && (
                <small className="p-error">{errors[name].message}</small>
            )
        );
    };

    const computeTimeSlots = (start: string, end: string, duration: number) => {
        const slots: string[] = [];
        let current = new Date(`1970-01-01T${start}`);
        const endTime = new Date(`1970-01-01T${end}`);

        while (current.getTime() + duration * 60000 <= endTime.getTime()) {
            const hours = current.getHours().toString().padStart(2, "0");
            const minutes = current.getMinutes().toString().padStart(2, "0");
            slots.push(`${hours}:${minutes}`);
            current = new Date(current.getTime() + duration * 60000);
        }

        return slots;
    };

    const updateAppointmentTimeOptions = (availableBlocks, date: Date) => {
        const dateString = date.toISOString().split("T")[0];

        // Filtramos doctores disponibles en esa fecha
        let availableDoctors: any[] = [];

        availableBlocks.forEach((item) => {
            item.days.forEach((day) => {
                if (day.date === dateString) {
                    availableDoctors.push({
                        ...item,
                        full_name: `${item.user.first_name || ""} ${item.user.middle_name || ""} ${item.user.last_name || ""} ${item.user.second_last_name || ""}`,
                        id: item.availability_id,
                        user_id: item.user.id // Agregamos el user_id para referencia
                    });
                }
            });
        });

        // Eliminar duplicados
        const uniqueDoctors = availableDoctors.filter((doctor, index, self) =>
            index === self.findIndex((d) => d.availability_id === doctor.availability_id)
        );

        // Actualizar opciones de doctores
        setUserAvailabilityOptions(uniqueDoctors);
    };

    const loadAssistantsForSelectedDoctor = (doctorId: string) => {
        if (!doctorId || !appointmentDate) {
            setAssistantAvailabilityOptions([]);
            return;
        }

        // Buscar el doctor seleccionado
        const selectedDoctor = userAvailabilityOptions.find(
            doc => doc.id === doctorId
        );

        if (!selectedDoctor || !selectedDoctor.user.assistants) {
            setAssistantAvailabilityOptions([]);
            return;
        }

        // Filtrar asistentes que tienen disponibilidad en la fecha seleccionada
        const dateString = appointmentDate.toISOString().split("T")[0];
        let availableAssistants: any[] = [];

        availableBlocks.forEach((item) => {
            // Buscar disponibilidades de asistentes del doctor seleccionado
            if (selectedDoctor.user.assistants.some(
                (assistant: any) => assistant.id === item.user.id
            )) {
                // Verificar que tenga disponibilidad en la fecha
                const hasAvailability = item.days.some(day => day.date === dateString);

                if (hasAvailability) {
                    availableAssistants.push({
                        ...item,
                        full_name: `${item.user.first_name || ""} ${item.user.middle_name || ""} ${item.user.last_name || ""} ${item.user.second_last_name || ""}`,
                        id: item.availability_id, // Usamos el ID de disponibilidad
                        user_id: item.user.id // Guardamos también el user_id
                    });
                }
            }
        });

        setAssistantAvailabilityOptions(availableAssistants);
    };

    const updateTimeSlotsForProfessional = (
        availableBlocks,
        dateString: string,
        availabilityId: string
    ) => {
        let blocks: any[] = [];

        availableBlocks.forEach((item) => {
            // Buscar por ID de disponibilidad
            if (item.availability_id === availabilityId) {
                item.days.forEach((day) => {
                    if (day.date === dateString) {
                        day.blocks.forEach((block) => {
                            blocks.push({
                                start: block.start_time,
                                end: block.end_time,
                                duration: item.appointment_duration,
                            });
                        });
                    }
                });
            }
        });

        let options: any[] = [];

        blocks.forEach((block) => {
            const slots = computeTimeSlots(block.start, block.end, block.duration);
            options = options.concat(
                slots.map((slot) => ({
                    label: slot,
                    value: slot,
                }))
            );
        });

        // Eliminar duplicados y ordenar
        let uniqueOptions = options.filter((option, index, self) =>
            index === self.findIndex((o) => o.value === option.value)
        ).sort((a, b) => a.value.localeCompare(b.value));

        // Filtrar horas pasadas si es la fecha actual
        const now = new Date();
        const todayDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
        const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

        if (dateString === todayDate) {
            uniqueOptions = uniqueOptions.filter(
                (option) => option.value >= currentTime
            );
        }

        setAppointmentTimeOptions(uniqueOptions);
        setValue("appointment_time", uniqueOptions[0]?.value || null);
    };



    const printAppointment = () => {
        // 
        generarFormato(
            "Cita", {
            fechaConsulta: appointmentDate?.toISOString().split("T")[0],
            horaConsulta: appointmentTime,
            patientId: patientId,
        },
            "Impresion"
        )
    }

    return (
        <>
            {/* Columna izquierda - Formulario */}
            <form className="needs-validation row" noValidate>
                <div className="col-12 px-3 mb-3">
                    <div className="row">
                        <div className="col-md-12">

                            <div className="mb-3">
                                <Controller
                                    name="user_specialty"
                                    control={control}
                                    rules={{ required: "Este campo es requerido" }}
                                    render={({ field }) => (
                                        <>
                                            <label htmlFor={field.name} className="form-label">
                                                Especialidad médica *
                                            </label>
                                            <Dropdown
                                                inputId={field.name}
                                                options={userSpecialties}
                                                optionLabel="label"
                                                filter
                                                showClear
                                                placeholder="Seleccione una especialidad"
                                                className={classNames("w-100", {
                                                    "p-invalid": errors.user_specialty,
                                                })}
                                                appendTo={"self"}
                                                {...field}
                                            ></Dropdown>
                                        </>
                                    )}
                                />
                                {getFormErrorMessage("user_specialty")}
                            </div>

                            {showUserSpecialtyError && (
                                <div className="alert alert-danger" role="alert">
                                    No hay especialistas de: <span>{userSpecialtyError}</span>{" "}
                                    disponibles en este momento
                                </div>
                            )}

                            <div className="mb-3">
                                <Controller
                                    name="appointment_date"
                                    control={control}
                                    rules={{ required: "Este campo es requerido" }}
                                    render={({ field }) => (
                                        <>
                                            <label htmlFor={field.name} className="form-label">
                                                Fecha de la consulta *
                                            </label>
                                            <Calendar
                                                id={field.name}
                                                value={field.value}
                                                onChange={(e) => field.onChange(e.value)}
                                                className={classNames("w-100", {
                                                    "p-invalid": errors.appointment_date,
                                                })}
                                                appendTo={"self"}
                                                disabled={appointmentDateDisabled}
                                                enabledDates={enabledDates}
                                                placeholder="Seleccione una fecha"
                                            />
                                        </>
                                    )}
                                />
                                {getFormErrorMessage("appointment_date")}
                            </div>

                            <div className="mb-3">
                                <Controller
                                    name="assigned_user_availability"
                                    control={control}
                                    rules={{ required: "Este campo es requerido" }}
                                    render={({ field }) => (
                                        <>
                                            <label htmlFor={field.name} className="form-label">
                                                Doctor(a) *
                                            </label>
                                            <Dropdown
                                                inputId={field.name}
                                                options={userAvailabilityOptions}
                                                optionLabel="full_name"
                                                filter
                                                placeholder="Seleccione un usuario"
                                                className={classNames("w-100", {
                                                    "p-invalid": errors.assigned_user_availability,
                                                })}
                                                appendTo={"self"}
                                                disabled={userAvailabilityDisabled}
                                                {...field}
                                            ></Dropdown>
                                        </>
                                    )}
                                />
                                {getFormErrorMessage("assigned_user_availability")}
                            </div>

                            {assistantAvailabilityOptions.length > 0 && (
                                <>
                                    <div className="mb-3">
                                        <Controller
                                            name="assigned_user_assistant_availability_id"
                                            control={control}
                                            render={({ field }) => (
                                                <>
                                                    <label htmlFor={field.name} className="form-label">
                                                        Asistente
                                                    </label>
                                                    <Dropdown
                                                        inputId={field.name}
                                                        options={assistantAvailabilityOptions}
                                                        optionLabel="full_name"
                                                        optionValue="id"
                                                        filter
                                                        showClear
                                                        placeholder="Seleccione un asistente"
                                                        className={classNames("w-100", {
                                                            "p-invalid":
                                                                errors.assigned_user_assistant_availability_id,
                                                        })}
                                                        appendTo={"self"}
                                                        disabled={userAvailabilityDisabled}
                                                        {...field}
                                                    ></Dropdown>
                                                </>
                                            )}
                                        />
                                    </div>
                                </>
                            )}

                            <div className="mb-3">
                                <Controller
                                    name="appointment_time"
                                    control={control}
                                    rules={{ required: "Este campo es requerido" }}
                                    render={({ field }) => (
                                        <>
                                            <label htmlFor={field.name} className="form-label">
                                                Hora de la consulta *
                                            </label>
                                            <Dropdown
                                                inputId={field.name}
                                                options={appointmentTimeOptions}
                                                virtualScrollerOptions={{ itemSize: 38 }}
                                                optionLabel="label"
                                                filter
                                                placeholder="Seleccione una hora"
                                                className={classNames("w-100", {
                                                    "p-invalid": errors.appointment_time,
                                                })}
                                                appendTo={"self"}
                                                disabled={appointmentTimeDisabled}
                                                {...field}
                                            ></Dropdown>
                                        </>
                                    )}
                                />
                                {getFormErrorMessage("appointment_time")}
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            <div className="d-flex justify-content-end">
                {isValid && (
                    <button
                        className="btn btn-secondary"
                        type="button"
                        onClick={printAppointment}
                    >
                        <span className="fa fa-print me-2"></span> Imprimir Cita
                    </button>
                )}
            </div>
        </>
    );
});
