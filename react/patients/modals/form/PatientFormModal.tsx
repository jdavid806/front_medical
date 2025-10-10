import React, { useState, useRef, useEffect } from "react";
import { Button } from "primereact/button";
import { Stepper } from "primereact/stepper";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputSwitch } from "primereact/inputswitch";
import { Controller, useForm } from "react-hook-form";
import { classNames } from "primereact/utils";

import {
  countryService,
  departmentService,
  cityService,
  entityService,
  patientService,
} from "../../../../services/api";
import { ErrorHandler } from "../../../../services/errorHandler";
import {
  dataURItoBlob,
  obtenerUltimaParteUrl,
} from "../../../../services/utilidades";
import { SwalManager } from "../../../../services/alertManagerImported";
import { StepperPanel } from "primereact/stepperpanel";
import CompanionModal from "./CompanionFormModal";
import {
  Companion,
  PatientFormFields,
  PatientFormModalProps,
  StepValidations,
} from "../interfaces/PatientFormType";
import { Toast } from "primereact/toast";

const PatientFormModal: React.FC<PatientFormModalProps> = ({
  visible,
  onHide,
  onSuccess,
  patientData,
}) => {
  const stepperRef = useRef<any>(null);
  const [hasCompanion, setHasCompanion] = useState(false);
  const [companions, setCompanions] = useState<Companion[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [entities, setEntities] = useState<any[]>([]);
  const [profileImage, setProfileImage] = useState<{
    url: string;
    file: File | null;
  }>({
    url: "/assets/img/profile/profile_default.jpg",
    file: null,
  });
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [showCompanionModal, setShowCompanionModal] = useState(false);
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      patient: {
        document_type: "",
        document_number: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        second_last_name: "",
        gender: "",
        date_of_birth: null as Date | null,
        whatsapp: "",
        email: "",
        civil_status: "",
        ethnicity: "",
        blood_type: "",
        country_id: "",
        department_id: "",
        city_id: "",
        address: "",
        nationality: "",
      },
      social_security: {
        entity_id: "",
        affiliate_type: "",
      },
    },
  });
  const documentTypeOptions = [
    { label: "CI - Cédula de Identidad", value: "CI" },
    { label: "CR - Carnet de Residencia", value: "CR" },
    { label: "CM - Carnet de Menor de Edad", value: "CM" },
    { label: "AN - Acta de Nacimiento", value: "AN" },
    { label: "LC - Licencia de Conducción", value: "LC" },
    { label: "Otros", value: "OT" },
  ];

  const genderOptions = [
    { label: "Masculino", value: "MALE" },
    { label: "Femenino", value: "FEMALE" },
    { label: "Indeterminado", value: "INDETERMINATE" },
    { label: "Otro", value: "OTHER" },
  ];

  const civilStatusOptions = [
    { label: "Soltero", value: "SINGLE" },
    { label: "Casado", value: "MARRIED" },
    { label: "Divorciado", value: "DIVORCED" },
    { label: "Viudo", value: "WIDOWED" },
  ];

  const ethnicityOptions = [
    { label: "Afrodesendiente", value: "Afrodesendiente" },
    { label: "Indigena", value: "Indigena" },
    { label: "Caucásica", value: "Caucásica" },
    { label: "Asiática", value: "Asiática" },
    { label: "Mestiza", value: "Mestiza" },
  ];

  const bloodTypeOptions = [
    { label: "No Refiere", value: "NO_REFIERE" },
    { label: "O Positivo", value: "O_POSITIVE" },
    { label: "O Negativo", value: "O_NEGATIVE" },
    { label: "A Positivo", value: "A_POSITIVE" },
    { label: "A Negativo", value: "A_NEGATIVE" },
    { label: "B Positivo", value: "B_POSITIVE" },
    { label: "B Negativo", value: "B_NEGATIVE" },
    { label: "AB Positivo", value: "AB_POSITIVE" },
    { label: "AB Negativo", value: "AB_NEGATIVE" },
  ];

  const regimeOptions = [
    { label: "Subsidiado", value: "subsidiado" },
    { label: "Contributivo", value: "contributivo" },
    { label: "Pensionado", value: "pensionado" },
    { label: "Privado", value: "privado" },
  ];

  const stepValidations: StepValidations = {
    0: [
      "patient.document_type",
      "patient.document_number",
      "patient.first_name",
      "patient.last_name",
      "patient.gender",
      "patient.date_of_birth",
      "patient.whatsapp",
      "patient.email",
      "patient.blood_type",
    ],
    1: [
      "patient.country_id",
      "patient.department_id",
      "patient.city_id",
      "patient.address",
      "patient.nationality",
    ],
    2: ["social_security.entity_id", "social_security.affiliate_type"],
  };

  const toast = useRef<Toast>(null);

  useEffect(() => {
    loadCountries();

    if (patientData) {
      setValue("patient.document_type", patientData.document_type);
      setValue("patient.document_number", patientData.document_number);
      setValue("patient.first_name", patientData.first_name);
      setValue("patient.middle_name", patientData.middle_name || "");
      setValue("patient.last_name", patientData.last_name);
      setValue("patient.second_last_name", patientData.second_last_name || "");
      setValue("patient.gender", patientData.gender);
      setValue("patient.date_of_birth", new Date(patientData.date_of_birth));
      setValue("patient.whatsapp", patientData.whatsapp);
      setValue("patient.email", patientData.email || "");
      setValue("patient.civil_status", patientData.civil_status);
      setValue("patient.ethnicity", patientData.ethnicity || "");
      setValue("patient.blood_type", patientData.blood_type);
      setValue("patient.country_id", patientData.country_id);
      setValue("patient.department_id", patientData.department_id);
      setValue("patient.city_id", patientData.city_id);
      setValue("patient.address", patientData.address);
      setValue("patient.nationality", patientData.nationality);

      if (patientData.social_security) {
        setValue(
          "social_security.entity_id",
          patientData.social_security.entity_id || ""
        );
        setValue(
          "social_security.affiliate_type",
          patientData.social_security.affiliate_type || ""
        );
      }

      if (patientData.minio_url) {
        setProfileImage({
          url: getUrlImage(patientData.minio_url),
          file: null,
        });
      }

      if (patientData.companions && patientData.companions.length > 0) {
        setHasCompanion(true);
        setCompanions(
          patientData.companions.map((comp) => ({
            first_name: comp.first_name,
            last_name: comp.last_name,
            document_type: comp.document_type,
            document_number: comp.document_number,
            relationship: comp.pivot.relationship,
            mobile: comp.mobile,
            email: comp.email || "",
          }))
        );
      }

      if (patientData.country_id) {
        handleCountryChange(patientData.country_id);
      }
    } else if (!patientData) {
      setProfileImage({
        url: "/assets/img/profile/profile_default.jpg",
        file: null,
      });
      setCompanions([]);
      setHasCompanion(false);
    }
  }, [patientData]);
  useEffect(() => {
    const initializeData = async () => {
      try {
        if (!visible) return;
        await Promise.all([loadCountries(), loadEntities()]);
        if (patientData) {
          const countryExists = countries.some(
            (c) => c.value === patientData.country_id
          );
          if (countryExists) {
            await handleCountryChange(patientData.country_id);

            if (patientData.department_id) {
              setValue("patient.department_id", patientData.department_id);
              await loadCities(patientData.department_id);

              if (patientData.city_id) {
                setValue("patient.city_id", patientData.city_id);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error inicializando datos:", error);
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Error al inicializar los datos del formulario",
          life: 5000,
        });
      }
    };

    initializeData();
  }, [visible, patientData]);

  useEffect(() => {
    if (patientData && !isLoadingCountries && countries.length > 0) {
      setValue("patient.country_id", patientData.country_id);

      const countryExists = countries.some(
        (c) => c.value === patientData.country_id
      );
      if (countryExists) {
        handleCountryChange(patientData.country_id).then(() => {
          if (patientData.department_id && departments.length > 0) {
            setValue("patient.department_id", patientData.department_id);
            loadCities(patientData.department_id).then(() => {
              if (patientData.city_id) {
                setValue("patient.city_id", patientData.city_id);
              }
            });
          }
        });
      }
    }
  }, [patientData, isLoadingCountries, countries]);

  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  const loadCountries = async () => {
    try {
      setIsLoadingCountries(true);
      const response = await countryService.getAll();
      const countryOptions = response.data.map((c: any) => ({
        label: c.name,
        value: c.name,
        customProperties: c,
      }));
      setCountries(countryOptions);
    } catch (error) {
      ErrorHandler.handle(error);
    } finally {
      setIsLoadingCountries(false);
    }
  };

  const loadCities = async (departmentId: string) => {
    try {
      if (!departmentId) {
        setCities([]);
        setValue("patient.city_id", "");
        return;
      }

      const department = departments.find((c) => c.value === departmentId);
      if (!department) {
        setCities([]);
        return;
      }

      const response = await cityService.getByDepartment(
        department.customProperties.id
      );
      const citiesData = Array.isArray(response)
        ? response
        : response?.data || [];

      if (!Array.isArray(citiesData)) {
        throw new Error("La respuesta de ciudades no es un array válido");
      }

      const cityOptions = citiesData.map((c: any) => ({
        label: c.name,
        value: c.name,
        customProperties: c,
      }));

      setCities(cityOptions);
    } catch (error) {
      console.error("Error loading cities:", error);
      setCities([]);
      SwalManager.error("Error al cargar ciudades");
    }
  };

  const loadEntities = async () => {
    try {
      const response = await entityService.getAll();
      setEntities(
        response.data.map((e: any) => ({ label: e.name, value: e.id }))
      );
    } catch (error) {
      ErrorHandler.handle(error);
    }
  };
  const handleCountryChange = async (value: string) => {
    try {
      setValue("patient.department_id", "");
      setValue("patient.city_id", "");
      setDepartments([]);
      setCities([]);

      setValue("patient.country_id", value);

      if (!value) {
        return;
      }

      const country = countries.find((c) => c.value === value);
      if (!country) {
        throw new Error(`País con valor "${value}" no encontrado`);
      }
      if (!country.customProperties || !country.customProperties.id) {
        throw new Error(
          `El país no tiene la estructura esperada (falta customProperties.id)`
        );
      }
      setIsLoading(true);
      const response = await departmentService.getByCountry(
        country.customProperties.id
      );

      if (!response) {
        throw new Error(
          "La respuesta del servicio de departamentos está vacía"
        );
      }
      const departmentsData = Array.isArray(response)
        ? response
        : response?.data || [];

      if (!Array.isArray(departmentsData)) {
        throw new Error("La respuesta de departamentos no es un array válido");
      }
      const depts = departmentsData.map((d) => ({
        label: d.name,
        value: d.name,
        customProperties: {
          id: d.id,
          ...d,
        },
      }));
      setDepartments(depts);

      if (patientData?.department_id && patientData.country_id === value) {
        const departmentExists = depts.some(
          (d) => d.value === patientData.department_id
        );
        if (departmentExists) {
          setValue("patient.department_id", patientData.department_id);
          await loadCities(patientData.department_id);
        }
      }
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.message || "Error al cargar departamentos",
        life: 5000,
      });
      setDepartments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfileImage({
            url: event.target.result as string,
            file: file,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCompanion = (companion: Companion) => {
    setCompanions([...companions, companion]);
    setShowCompanionModal(false);
  };
  const toggleCamera = async () => {
    if (showCamera) {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
        setCameraStream(null);
      }
      setShowCamera(false);
      setIsCameraLoading(false);
    } else {
      try {
        setIsCameraLoading(true);
        setShowCamera(true);

        const constraints = {
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        };

        if (window.innerWidth < 768) {
          constraints.video.width = { ideal: window.innerWidth };
          constraints.video.height = { ideal: window.innerHeight * 0.4 };
        }

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        setCameraStream(stream);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current
              ?.play()
              .then(() => setIsCameraLoading(false))
              .catch((error) => {
                console.error("Error al reproducir video:", error);
                setIsCameraLoading(false);
                SwalManager.error("Error al iniciar la cámara");
              });
          };
        }
      } catch (error) {
        console.error("Error al acceder a la cámara:", error);
        setIsCameraLoading(false);
        setShowCamera(false);
        SwalManager.error(
          "No se pudo acceder a la cámara. Verifica los permisos."
        );
      }
    }
  };

  const capturePhoto = (e: React.MouseEvent) => {
    e.preventDefault();

    if (videoRef.current && videoRef.current.readyState >= 2) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        const imageDataUrl = canvas.toDataURL("image/jpeg", 0.8);
        const blob = dataURItoBlob(imageDataUrl);
        const file = new File([blob], "profile.jpg", { type: "image/jpeg" });

        setProfileImage({
          url: imageDataUrl,
          file: file,
        });

        if (cameraStream) {
          cameraStream.getTracks().forEach((track) => track.stop());
          setCameraStream(null);
        }
        setShowCamera(false);
      }
    }
  };

  const removeCompanion = (index: number) => {
    setCompanions(companions.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: any) => {
    try {
      for (let i = 0; i < Object.keys(stepValidations).length; i++) {
        const isValid = await validateStep(i);
        if (!isValid) {
          stepperRef.current?.goto(i);
          return;
        }
      }
      const formData = {
        patient: {
          first_name: "",
          last_name: "",
          middle_name: "",
          second_last_name: "",
          document_type: "",
          document_number: "",
          gender: "",
          date_of_birth: "",
          whatsapp: "",
          email: "",
          civil_status: "",
          ethnicity: "",
          blood_type: "",
          country_id: "",
          department_id: "",
          city_id: "",
          address: "",
          nationality: "",
        },
        social_security: {
          entity_id: "",
          arl: "",
          afp: "",
        },
        companions: [],
      };

      Object.keys(data.patient).forEach((key) => {
        const value = data.patient[key];
        if (value !== null && value !== undefined && value !== "") {
          if (key === "date_of_birth" && value instanceof Date) {
            formData.patient[`${key}`] = value.toISOString();
          } else {
            formData.patient[`${key}`] = String(value);
          }
        }
      });

      formData.patient.first_name = data.patient.first_name.toUpperCase();
      formData.patient.last_name = data.patient.last_name.toUpperCase();
      formData.patient.middle_name =
        data.patient.middle_name?.toUpperCase() || "";
      formData.patient.second_last_name =
        data.patient.second_last_name?.toUpperCase() || "";

      Object.keys(data.social_security).forEach((key) => {
        const value = data.social_security[key];
        if (value !== null && value !== undefined && value !== "") {
          formData.social_security[`${key}`] = String(value);
        }
      });

      companions.forEach((companion) => {
        const newCompanion = {
          first_name: companion.first_name?.toUpperCase() || "",
          last_name: companion.last_name?.toUpperCase() || "",
          document_type: companion.document_type,
          document_number: companion.document_number,
          relationship: companion.relationship,
          mobile: companion.mobile,
          email: companion.email || "",
        };
        formData.companions.push(newCompanion);
      });

      let response;
      let patientId;

      if (patientData) {
        patientId = patientData.id;
        response = await patientService.updatePatient(patientId, formData);
      } else {
        response = await patientService.storePatient(formData);
        patientId = response.message[0].id;
      }

      if (profileImage.file) {
        try {
          // @ts-ignore
          const minioUrl = await guardarArchivoPaciente(
            "patientFileInputModal",
            patientId,
            profileImage.file
          );
          if (minioUrl) {
            await patientService.update(patientId, {
              minio_url: minioUrl,
            });
          }
        } catch (error) {
          console.error("Error al subir la imagen de perfil:", error);
          toast.current?.show({
            severity: "warn",
            summary: "Advertencia",
            detail:
              "El paciente se guardó pero hubo un error al subir la imagen",
            life: 5000,
          });
        }
      }
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: patientData
          ? "Paciente actualizado correctamente"
          : "Paciente creado correctamente",
        life: 3000,
      });
      const url = obtenerUltimaParteUrl();
      if (["verPaciente"].includes(url)) {
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
      onHide();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error("Error completo:", error);

      let errorMessage = patientData
        ? "Error al actualizar el paciente"
        : "Error al crear el paciente";

      if (error.response) {
        if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data?.errors) {
          errorMessage = Object.entries(error.response.data.errors)
            .map(
              ([field, errors]) =>
                `${field}: ${(errors as string[]).join(", ")}`
            )
            .join("; ");
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: errorMessage,
        life: 5000,
      });
    }
  };

  const validateStep = async (stepIndex: number): Promise<boolean> => {
    const fields = stepValidations[stepIndex];
    if (!fields) return true;

    const isValid = await trigger(fields as any);
    if (!isValid) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: `Por favor complete todos los campos requeridos en el paso ${
          stepIndex + 1
        }`,
        life: 3000,
      });
    }
    return isValid;
  };

  const validateAndNext = async () => {
    const currentStep = stepperRef.current?.getActiveStep();
    if (currentStep === undefined) return;

    const isValid = await validateStep(currentStep);
    if (isValid && stepperRef.current) {
      if (currentStep < Object.keys(stepValidations).length - 1) {
        stepperRef.current.nextCallback();
      }
    }
  };

  const getFormErrorMessage = (name: string) => {
    const nameParts = name.split(".");
    let errorObj = errors as any;

    for (const part of nameParts) {
      errorObj = errorObj?.[part];
      if (!errorObj) break;
    }

    return errorObj && <small className="p-error">{errorObj.message}</small>;
  };

  const renderBasicInfoStep = () => (
    <StepperPanel header="Datos Generales">
      <div className="row">
        <div className="col-md-8">
          <Card title="Datos Personales" className="mb-4">
            <div className="row">
              <div className="col-md-6">
                <Controller
                  name="patient.document_type"
                  control={control}
                  rules={{ required: "Tipo de documento es requerido" }}
                  render={({ field, fieldState }) => {
                    return (
                      <div>
                        <label className="form-label">
                          Tipo de documento *
                        </label>
                        <Dropdown
                          appendTo="self"
                          options={documentTypeOptions}
                          optionLabel="label"
                          optionValue="value"
                          placeholder="Seleccione"
                          className={classNames("w-100", {
                            "is-invalid": fieldState.error,
                          })}
                          value={field.value || ""}
                          onChange={(e) => {
                            field.onChange(e.value);
                          }}
                        />
                        {getFormErrorMessage(field.name)}
                      </div>
                    );
                  }}
                />
                <Controller
                  name="patient.first_name"
                  control={control}
                  rules={{ required: "Primer nombre es requerido" }}
                  render={({ field, fieldState }) => (
                    <div>
                      <label className="form-label">Primer nombre *</label>
                      <InputText
                        className={classNames("w-100", {
                          "is-invalid": fieldState.error,
                        })}
                        {...field}
                      />
                      {getFormErrorMessage(field.name)}
                    </div>
                  )}
                />
                <Controller
                  name="patient.last_name"
                  control={control}
                  rules={{ required: "Primer apellido es requerido" }}
                  render={({ field, fieldState }) => (
                    <div>
                      <label className="form-label">Primer apellido *</label>
                      <InputText
                        className={classNames("w-100", {
                          "is-invalid": fieldState.error,
                        })}
                        {...field}
                      />
                      {getFormErrorMessage(field.name)}
                    </div>
                  )}
                />
              </div>
              <div className="col-md-6">
                <Controller
                  name="patient.document_number"
                  control={control}
                  rules={{ required: "Número de documento es requerido" }}
                  render={({ field, fieldState }) => (
                    <div>
                      <label className="form-label">
                        Número de documento *
                      </label>
                      <InputText
                        className={classNames("w-100", {
                          "is-invalid": fieldState.error,
                        })}
                        {...field}
                      />
                      {getFormErrorMessage(field.name)}
                    </div>
                  )}
                />
                <Controller
                  name="patient.middle_name"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <label className="form-label">Segundo Nombre *</label>
                      <InputText className={classNames("w-100")} {...field} />
                    </div>
                  )}
                />
                <Controller
                  name="patient.second_last_name"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <label className="form-label">Segundo apellido *</label>
                      <InputText className={classNames("w-100")} {...field} />
                    </div>
                  )}
                />
              </div>
            </div>
          </Card>
          <Card title="Información Adicional">
            <div className="row">
              {/* Columna izquierda */}
              <div className="col-md-6">
                <Controller
                  name="patient.gender"
                  control={control}
                  rules={{ required: "Género es requerido" }}
                  render={({ field, fieldState }) => (
                    <div>
                      <label className="form-label">Género *</label>
                      <Dropdown
                        options={genderOptions}
                        placeholder="Seleccione"
                        className={classNames("w-100", {
                          "is-invalid": fieldState.error,
                        })}
                        value={field.value}
                        onChange={(e) => field.onChange(e.value)}
                        appendTo={"self"}
                      />
                      {getFormErrorMessage(field.name)}
                    </div>
                  )}
                />
                <Controller
                  name="patient.whatsapp"
                  control={control}
                  rules={{ required: "WhatsApp es requerido" }}
                  render={({ field, fieldState }) => (
                    <div>
                      <label className="form-label">WhatsApp *</label>
                      <InputText
                        className={classNames("w-100", {
                          "is-invalid": fieldState.error,
                        })}
                        {...field}
                      />
                      {getFormErrorMessage(field.name)}
                    </div>
                  )}
                />
                <Controller
                  name="patient.civil_status"
                  control={control}
                  rules={{ required: "Estado civil es requerido" }}
                  render={({ field, fieldState }) => (
                    <div>
                      <label className="form-label">Estado Civil *</label>
                      <Dropdown
                        options={civilStatusOptions}
                        placeholder="Seleccione"
                        className={classNames("w-100 h-20", {
                          "is-invalid": fieldState.error,
                        })}
                        value={field.value}
                        onChange={(e) => field.onChange(e.value)}
                        appendTo={"self"}
                      />
                      {getFormErrorMessage(field.name)}
                    </div>
                  )}
                />
                <Controller
                  name="patient.ethnicity"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <label className="form-label">Etnia</label>
                      <Dropdown
                        options={ethnicityOptions}
                        placeholder="Seleccione"
                        className="w-100 h-50"
                        value={field.value}
                        onChange={(e) => field.onChange(e.value)}
                        appendTo="self"
                        scrollHeight="140px"
                      />
                    </div>
                  )}
                />
              </div>
              <div className="col-md-6">
                <Controller
                  name="patient.date_of_birth"
                  control={control}
                  rules={{
                    required: "Fecha de nacimiento es requerida",
                  }}
                  render={({ field, fieldState }) => (
                    <div>
                      <label className="form-label">
                        Fecha de nacimiento *
                      </label>
                      <Calendar
                        className={classNames("w-100", {
                          "is-invalid": fieldState.error,
                        })}
                        value={field.value}
                        onChange={(e) => field.onChange(e.value)}
                        dateFormat="dd/mm/yy"
                        showIcon
                        maxDate={new Date()}
                        appendTo={"self"}
                      />
                      {getFormErrorMessage(field.name)}
                    </div>
                  )}
                />
                <Controller
                  name="patient.email"
                  control={control}
                  render={({ field, fieldState }) => (
                    <div className="mb-1">
                      <label className="form-label">Correo electrónico *</label>
                      <InputText
                        className={classNames("w-100", {
                          "is-invalid": fieldState.error,
                        })}
                        {...field}
                      />
                      {getFormErrorMessage(field.name)}
                    </div>
                  )}
                />
                <Controller
                  name="patient.blood_type"
                  control={control}
                  rules={{ required: "Tipo de sangre es requerido" }}
                  render={({ field, fieldState }) => (
                    <div>
                      <label className="form-label">Tipo de sangre *</label>
                      <Dropdown
                        options={bloodTypeOptions}
                        placeholder="Seleccione"
                        className={classNames("w-100", {
                          "is-invalid": fieldState.error,
                        })}
                        value={field.value}
                        onChange={(e) => field.onChange(e.value)}
                        appendTo={"self"}
                      />
                      {getFormErrorMessage(field.name)}
                    </div>
                  )}
                />
              </div>
            </div>
          </Card>
        </div>
        <div className="col-md-4">
          <Card
            title="Foto de Perfil"
            className="h-auto"
            style={{ maxHeight: "500px" }}
          >
            <div className="d-flex flex-column">
              <div
                className="d-flex align-items-center justify-content-center mb-3"
                style={{ minHeight: "250px" }}
              >
                {!showCamera ? (
                  <>
                    <img
                      src={profileImage.url}
                      alt="Previsualización"
                      className="img-fluid rounded-circle shadow"
                      style={{
                        width: "100%",
                        maxWidth: "250px",
                        aspectRatio: "1/1",
                        objectFit: "cover",
                        border: "3px solid #dee2e6",
                      }}
                    />
                  </>
                ) : (
                  <div
                    className="w-100 position-relative"
                    style={{
                      height: "250px",
                      maxHeight: "50vh",
                      minHeight: "200px",
                    }}
                  >
                    {isCameraLoading && (
                      <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-secondary bg-opacity-25">
                        <i
                          className="pi pi-spinner pi-spin"
                          style={{ fontSize: "2rem" }}
                        ></i>
                      </div>
                    )}
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-100 h-100 rounded shadow-sm"
                      style={{
                        objectFit: "cover",
                        display: isCameraLoading ? "none" : "block",
                        backgroundColor: "#f8f9fa",
                        border: "2px solid #dee2e6",
                      }}
                    />
                    <div
                      className="position-absolute top-0 start-0 w-100 h-100"
                      style={{
                        border: "2px dashed rgba(255,255,255,0.7)",
                        pointerEvents: "none",
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="d-grid gap-2">
                {!showCamera && (
                  <>
                    <Button
                      type="button"
                      icon="pi pi-upload"
                      label="Subir Imagen"
                      className="w-100"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <i className="fas fa-plus "></i>
                    </Button>
                    <input
                      id="patientFileInputModal"
                      type="file"
                      ref={fileInputRef}
                      className="d-none"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </>
                )}
                <Button
                  icon={showCamera ? "pi pi-check" : "pi pi-camera"}
                  label={showCamera ? "Capturar Foto" : "Tomar Foto"}
                  severity={showCamera ? "success" : "secondary"}
                  className="w-100"
                  onClick={(e) => {
                    if (showCamera) {
                      capturePhoto(e);
                    } else {
                      toggleCamera();
                    }
                  }}
                  type={showCamera ? "button" : "button"}
                  loading={isCameraLoading}
                >
                  {" "}
                  <i className="fas fa-camera "></i>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
      <div className="d-flex justify-content-end pt-4">
        <Button
          label="Siguiente"
          type="button"
          className="btn btn-primary btn-sm"
          icon={<i className="fas fa-arrow-right me-2"></i>}
          iconPos="right"
          onClick={validateAndNext}
        />
      </div>
    </StepperPanel>
  );
  const renderResidenceStep = () => (
    <StepperPanel header="Datos de Residencia">
      <div className="row">
        <div className="col-md-12">
          <Card title="Información de Residencia" className="mb-4">
            <div className="row">
              <div className="col-md-6">
                <Controller
                  name="patient.country_id"
                  control={control}
                  rules={{ required: "País es requerido" }}
                  render={({ field, fieldState }) => (
                    <div className="mb-3">
                      <label className="form-label">País *</label>
                      <Dropdown
                        appendTo="self"
                        options={countries}
                        placeholder="Seleccione"
                        className={classNames("w-100", {
                          "is-invalid": fieldState.error,
                        })}
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e.value);
                          handleCountryChange(e.value);
                        }}
                        filter
                        filterBy="label"
                        showClear
                        resetFilterOnHide
                        filterPlaceholder="Buscar País..."
                      />
                      {getFormErrorMessage(field.name)}
                    </div>
                  )}
                />
                <Controller
                  name="patient.city_id"
                  control={control}
                  rules={{ required: "Ciudad es requerida" }}
                  render={({ field, fieldState }) => (
                    <div className="mb-3">
                      <label className="form-label">Ciudad *</label>
                      <Dropdown
                        appendTo="self"
                        options={cities}
                        placeholder={
                          cities.length === 0
                            ? "Seleccione un departamento primero"
                            : "Seleccione"
                        }
                        className={classNames("w-100", {
                          "is-invalid": fieldState.error,
                        })}
                        value={field.value}
                        onChange={(e) => field.onChange(e.value)}
                        disabled={
                          !watch("patient.department_id") || cities.length === 0
                        }
                        filter
                        filterBy="label"
                        showClear
                        resetFilterOnHide
                        filterPlaceholder="Buscar Ciudad..."
                      />
                      {getFormErrorMessage(field.name)}
                      {watch("patient.department_id") &&
                        cities.length === 0 && (
                          <small className="text-muted">
                            Cargando ciudades...
                          </small>
                        )}
                    </div>
                  )}
                />
              </div>
              <div className="col-md-6">
                <Controller
                  name="patient.department_id"
                  control={control}
                  rules={{ required: "Departamento es requerido" }}
                  render={({ field, fieldState }) => (
                    <div className="mb-3">
                      <label className="form-label">
                        Departamento o provincia *
                      </label>
                      <Dropdown
                        appendTo="self"
                        options={departments}
                        placeholder="Seleccione"
                        className={classNames("w-100", {
                          "is-invalid": fieldState.error,
                        })}
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e.value);
                          loadCities(e.value);
                        }}
                        disabled={!watch("patient.country_id")}
                        filter
                        filterBy="label"
                        showClear
                        resetFilterOnHide
                        filterPlaceholder="Buscar Departamento o provincia..."
                      />
                      {getFormErrorMessage(field.name)}
                    </div>
                  )}
                />
                <Controller
                  name="patient.nationality"
                  control={control}
                  rules={{ required: "Nacionalidad es requerida" }}
                  render={({ field, fieldState }) => (
                    <div className="mb-3">
                      <label className="form-label">Nacionalidad *</label>
                      <Dropdown
                        appendTo="self"
                        options={countries}
                        placeholder="Seleccione"
                        className={classNames("w-100", {
                          "is-invalid": fieldState.error,
                        })}
                        value={field.value}
                        onChange={(e) => field.onChange(e.value)}
                        filter
                        filterBy="label"
                        showClear
                        resetFilterOnHide
                        filterPlaceholder="Buscar aseguradora..."
                      />
                      {getFormErrorMessage(field.name)}
                    </div>
                  )}
                />
              </div>
              <div className="col-md-12">
                <Controller
                  name="patient.address"
                  control={control}
                  rules={{ required: "Dirección es requerida" }}
                  render={({ field, fieldState }) => (
                    <div className="mb-3">
                      <label className="form-label">Dirección *</label>
                      <InputText
                        className={classNames("w-100", {
                          "is-invalid": fieldState.error,
                        })}
                        {...field}
                      />
                      {getFormErrorMessage(field.name)}
                    </div>
                  )}
                />
              </div>
            </div>
          </Card>
          <div className="mb-4">
            <div
              className="d-flex align-items-center mb-3"
              style={{ gap: "0.5rem", alignItems: "center" }}
            >
              <InputSwitch
                id="companionSwitch"
                checked={hasCompanion}
                onChange={(e) => setHasCompanion(e.value)}
                style={{ marginTop: "-2px" }}
              />
              <label htmlFor="companionSwitch" style={{ userSelect: "none" }}>
                Agregar Acompañante
              </label>
            </div>
          </div>
          <div className="mb-4">
            {hasCompanion && (
              <Card>
                <div className="p-3">
                  <h5 className="mb-3">Información del acompañante</h5>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <Button
                      type="button"
                      icon="pi pi-plus"
                      label="Agregar Acompañante "
                      size="small"
                      onClick={() => setShowCompanionModal(true)}
                    >
                      <i className="fas fa-plus"></i>
                    </Button>
                  </div>
                  <DataTable
                    value={companions}
                    size="small"
                    emptyMessage="No hay acompañantes agregados"
                    className="p-datatable p-component p-datatable-selectable p-datatable-scrollable p-datatable-responsive-scroll p-datatable-gridlines"
                  >
                    <Column field="first_name" header="Nombre" />
                    <Column field="last_name" header="Apellido" />
                    <Column field="relationship" header="Parentesco" />
                    <Column
                      field="document_number"
                      header="Número de identificación"
                    />
                    <Column field="mobile" header="WhatsApp" />
                    <Column
                      field="actions"
                      header="Acciones"
                      body={(_, { rowIndex }) => (
                        <Button
                          severity="danger"
                          size="small"
                          onClick={() => removeCompanion(rowIndex)}
                        >
                          {" "}
                          <i className="fa-solid fa-trash"></i>{" "}
                        </Button>
                      )}
                      style={{ width: "2rem", paddingRight: "0.5rem" }}
                    />
                  </DataTable>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-between pt-4">
        <Button
          label="Atrás"
          type="button"
          className="btn btn-secondary btn-sm"
          icon={<i className="fas fa-arrow-left me-1"></i>}
          onClick={() => stepperRef.current?.prevCallback()}
        />
        <Button
          label="Siguiente"
          type="button"
          icon={<i className="fas fa-arrow-right me-2"></i>}
          iconPos="right"
          className="btn btn-primary btn-sm"
          onClick={validateAndNext}
        />
      </div>
    </StepperPanel>
  );
  const renderSocialSecurityStep = () => (
    <StepperPanel header="Seguridad social y Afiliación">
      <div className="row">
        <div className="col-md-12">
          <Card title="Seguridad Social" className="mb-4">
            <div className="row">
              <div className="col-md-12">
                <Controller
                  name="social_security.entity_id"
                  control={control}
                  rules={{ required: "Aseguradora es requerida" }}
                  render={({ field, fieldState }) => (
                    <div className="mb-3">
                      <label className="form-label">Aseguradora *</label>
                      <Dropdown
                        appendTo="self"
                        options={entities}
                        placeholder="Seleccione"
                        className={classNames("w-100", {
                          "is-invalid": fieldState.error,
                        })}
                        value={field.value}
                        onChange={(e) => field.onChange(e.value)}
                      />
                      {getFormErrorMessage(field.name)}
                    </div>
                  )}
                />
              </div>
              <div className="col-md-12">
                <Controller
                  name="social_security.affiliate_type"
                  control={control}
                  rules={{ required: "ARS Y TIPO DE REGIMEN es requerida" }}
                  render={({ field, fieldState }) => (
                    <div className="mb-3">
                      <label className="form-label">
                        ARS Y TIPO DE REGIMEN *
                      </label>
                      <Dropdown
                        appendTo="self"
                        options={regimeOptions}
                        placeholder="Seleccione"
                        className={classNames("w-100", {
                          "is-invalid": fieldState.error,
                        })}
                        value={field.value}
                        onChange={(e) => field.onChange(e.value)}
                      />
                      {getFormErrorMessage(field.name)}
                    </div>
                  )}
                />
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="d-flex justify-content-between pt-4">
        <Button
          label="Atrás"
          type="button"
          className="btn btn-secondary btn-sm"
          icon={<i className="fas fa-arrow-left me-1"></i>}
          onClick={() => stepperRef.current?.prevCallback()}
        />
        <Button
          type="submit"
          label="Finalizar"
          iconPos="right"
          icon={<i className="fas fa-save me-1"></i>}
          className="btn btn-primary btn-sm"
          onClick={async (e) => {
            e.preventDefault();
            const basicValid = await trigger([
              "patient.document_type",
              "patient.document_number",
            ]);

            const residenceValid = await trigger(["patient.country_id"]);

            const securityValid = await trigger(["social_security.entity_id"]);

            if (basicValid && residenceValid && securityValid) {
              handleSubmit(onSubmit)();
            } else {
              toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: "Por favor complete todos los campos requeridos",
                life: 3000,
              });
            }
          }}
        />
      </div>
    </StepperPanel>
  );
  return (
    <>
      <Toast ref={toast} />
      <Dialog
        visible={visible}
        onHide={onHide}
        header="Nuevo Paciente"
        style={{
          width: "90vw",
          maxWidth: "1200px",
          height: "100vh",
          maxHeight: "900px",
        }}
        appendTo={"self"}
        maximizable
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stepper ref={stepperRef}>
            {renderBasicInfoStep()}
            {renderResidenceStep()}
            {renderSocialSecurityStep()}
          </Stepper>
        </form>

        <CompanionModal
          visible={showCompanionModal}
          onHide={() => setShowCompanionModal(false)}
          onSave={handleAddCompanion}
        />
      </Dialog>
    </>
  );
};

export default PatientFormModal;
