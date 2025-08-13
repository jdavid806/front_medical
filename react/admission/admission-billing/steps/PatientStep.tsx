import React from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputSwitch } from "primereact/inputswitch";
import { Controller, useForm } from "react-hook-form";
import { classNames } from "primereact/utils";

import {
  documentTypeOptions,
  genderOptions,
  bloodTypeOptions,
} from "../utils/constants";
import { validatePatientStep } from "../utils/helpers";
import { PatientStepProps, FormData } from "../interfaces/AdmisionBilling";

const PatientStep: React.FC<PatientStepProps> = ({
  formData,
  updateFormData,
  nextStep,
  toast,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<FormData>({
    defaultValues: formData,
  });

  const handlePatientChange = <K extends keyof FormData["patient"]>(
    field: K,
    value: FormData["patient"][K]
  ) => {
    updateFormData("patient", { [field]: value });
  };

  const handleBillingChange = <K extends keyof FormData["billing"]>(
    field: K,
    value: FormData["billing"][K]
  ) => {
    updateFormData("billing", { [field]: value });
  };

  const toggleBillingType = (type: "entity" | "consumer") => {
    if (type === "entity") {
      updateFormData("patient", {
        facturacionEntidad: !formData.patient.facturacionEntidad,
        facturacionConsumidor: false,
      });
    } else {
      updateFormData("patient", {
        facturacionConsumidor: !formData.patient.facturacionConsumidor,
        facturacionEntidad: false,
      });
    }
  };

  const toggleCompanion = (value: boolean) => {
    handlePatientChange("hasCompanion", value);
  };

  const handleNext = async () => {
    const isValid = await trigger([
      "patient.documentNumber",
      "patient.nameComplet",
      "patient.gender",
      "patient.whatsapp",
      "patient.email",
      "patient.address",
      "patient.city",
      "patient.affiliateType",
      "patient.insurance",
    ] as const);

    if (isValid && validatePatientStep(formData.patient, toast)) {
      nextStep();
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

  return (
    <div className="row">
      <div className="col-12">
        <Card title="Datos Personales" className="mb-4">
          <div className="row">
            <div className="col-md-6">
              <Controller
                name="patient.nameComplet"
                control={control}
                rules={{ required: "Nombre completo es requerido" }}
                render={({ field, fieldState }) => (
                  <div className="mb-3">
                    <label className="form-label">Nombre Paciente *</label>
                    <InputText
                      className={classNames("w-100", {
                        "p-invalid": fieldState.error,
                      })}
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        handlePatientChange("nameComplet", e.target.value);
                      }}
                    />
                    {getFormErrorMessage("patient.nameComplet")}
                  </div>
                )}
              />
              <Controller
                name="patient.documentNumber"
                control={control}
                rules={{ required: "Número de documento es requerido" }}
                render={({ field, fieldState }) => (
                  <div className="mb-3">
                    <label className="form-label">Número de documento *</label>
                    <InputText
                      className={classNames("w-100", {
                        "p-invalid": fieldState.error,
                      })}
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        handlePatientChange("documentNumber", e.target.value);
                      }}
                    />
                    {getFormErrorMessage("patient.documentNumber")}
                  </div>
                )}
              />
            </div>

            <div className="col-md-6">
              <Controller
                name="patient.gender"
                control={control}
                rules={{ required: "Género es requerido" }}
                render={({ field, fieldState }) => (
                  <div className="mb-3">
                    <label className="form-label">Género *</label>
                    <Dropdown
                      options={genderOptions}
                      placeholder="Seleccione"
                      className={classNames("w-100", {
                        "p-invalid": fieldState.error,
                      })}
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e.value);
                        handlePatientChange("gender", e.value);
                      }}
                      appendTo="self"
                    />
                    {getFormErrorMessage("patient.gender")}
                  </div>
                )}
              />
              <Controller
                name="patient.address"
                control={control}
                rules={{ required: "Dirección es requerido" }}
                render={({ field, fieldState }) => (
                  <div className="mb-3">
                    <label className="form-label">Dirección *</label>
                    <InputText
                      className={classNames("w-100", {
                        "p-invalid": fieldState.error,
                      })}
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        handlePatientChange("address", e.target.value);
                      }}
                    />
                    {getFormErrorMessage("patient.address")}
                  </div>
                )}
              />
            </div>
          </div>
        </Card>

        <Card title="Información Adicional" className="mb-4">
          <div className="row">
            <div className="col-md-6">
              <Controller
                name="patient.whatsapp"
                control={control}
                rules={{ required: "WhatsApp es requerido" }}
                render={({ field, fieldState }) => (
                  <div className="mb-3">
                    <label className="form-label">WhatsApp *</label>
                    <InputText
                      className={classNames("w-100", {
                        "p-invalid": fieldState.error,
                      })}
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        handlePatientChange("whatsapp", e.target.value);
                      }}
                    />
                    {getFormErrorMessage("patient.whatsapp")}
                  </div>
                )}
              />

              <Controller
                name="patient.email"
                control={control}
                rules={{
                  required: "Correo electrónico es requerido",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Correo electrónico no válido",
                  },
                }}
                render={({ field, fieldState }) => (
                  <div className="mb-3">
                    <label className="form-label">Correo electrónico *</label>
                    <InputText
                      className={classNames("w-100", {
                        "p-invalid": fieldState.error,
                      })}
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        handlePatientChange("email", e.target.value);
                      }}
                    />
                    {getFormErrorMessage("patient.email")}
                  </div>
                )}
              />

              <Controller
                name="patient.insurance"
                control={control}
                render={({ field, fieldState }) => (
                  <div className="mb-3">
                    <label className="form-label">Aseguradora</label>
                    <InputText
                      className="w-100"
                      value={field.value || ""}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        handlePatientChange("insurance", e.target.value);
                      }}
                    />
                    {getFormErrorMessage("patient.insurance")}
                  </div>
                )}
              />
            </div>

            <div className="col-md-6">
              <Controller
                name="patient.city"
                control={control}
                render={({ field, fieldState }) => (
                  <div className="mb-3">
                    <label className="form-label">Ciudad</label>
                    <InputText
                      className={classNames("w-100", {
                        "p-invalid": fieldState.error,
                      })}
                      value={field.value || ""}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        handlePatientChange("city", e.target.value);
                      }}
                    />
                    {getFormErrorMessage("patient.city")}
                  </div>
                )}
              />
              <Controller
                name="patient.affiliateType"
                control={control}
                render={({ field, fieldState }) => (
                  <div className="mb-3">
                    <label className="form-label">Tipo de afiliado</label>
                    <InputText
                      className="w-100"
                      value={field.value || ""}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        handlePatientChange("affiliateType", e.target.value);
                      }}
                    />
                    {getFormErrorMessage("patient.affiliateType")}
                  </div>
                )}
              />
            </div>
          </div>
        </Card>

        <div className="container-fluid">
          <div className="row justify-content-center">

            
        <div className="col-lg-12 col-md-10 col-12 mb-4 w-40">
          <Card title="Facturación Consumidor" className="h-100">
            <div className="d-flex align-items-center mb-3">
              <InputSwitch
                checked={formData.patient.facturacionConsumidor}
                onChange={() => toggleBillingType("consumer")}
                disabled={formData.patient.facturacionEntidad}
                className="me-3 bg-primary"
              />
              <span className="text-muted small">facturación consumidor</span>
            </div>
          </Card>
        </div>
            <div className="col-lg-12 col-md-10 col-12 mb-4">
              <Card title="Facturación por Entidad" className="h-100">
                <div className="d-flex align-items-center mb-3">
                  <InputSwitch
                    checked={formData.patient.facturacionEntidad}
                    onChange={() => toggleBillingType("entity")}
                    disabled={formData.patient.facturacionConsumidor}
                    className="me-3 bg-primary"
                  />
                  <span className="text-muted small">
                    Activar facturación por entidad
                  </span>
                </div>

                {formData.patient.facturacionEntidad && (
                  <div>
                    <Controller
                      name="billing.entity"
                      control={control}
                      rules={{ required: "Entidad es requerida" }}
                      render={({ field, fieldState }) => (
                        <div className="mb-3">
                          <label className="form-label">Entidad *</label>
                          <InputText
                            className={classNames("w-100", {
                              "p-invalid": fieldState.error,
                            })}
                            value={field.value || ""}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              handleBillingChange("entity", e.target.value);
                            }}
                          />
                          {getFormErrorMessage("billing.entity")}
                        </div>
                      )}
                    />

                    <Controller
                      name="billing.authorizationDate"
                      control={control}
                      render={({ field }) => (
                        <div className="mb-3">
                          <label className="form-label">
                            Fecha de autorización
                          </label>
                          <Calendar
                            className="w-100"
                            value={field.value}
                            onChange={(e) => {
                              field.onChange(e.value);
                              handleBillingChange("authorizationDate", e.value);
                            }}
                            dateFormat="dd/mm/yy"
                            showIcon
                            appendTo="self"
                          />
                        </div>
                      )}
                    />

                    <Controller
                      name="billing.authorizationNumber"
                      control={control}
                      rules={{
                        required: "Número de autorización es requerido",
                      }}
                      render={({ field, fieldState }) => (
                        <div className="mb-3">
                          <label className="form-label">
                            N° Autorización *
                          </label>
                          <InputText
                            className={classNames("w-100", {
                              "p-invalid": fieldState.error,
                            })}
                            value={field.value || ""}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              handleBillingChange(
                                "authorizationNumber",
                                e.target.value
                              );
                            }}
                          />
                          {getFormErrorMessage("billing.authorizationNumber")}
                        </div>
                      )}
                    />

                    <Controller
                      name="billing.authorizedAmount"
                      control={control}
                      render={({ field }) => (
                        <div className="mb-3">
                          <label className="form-label">Monto Autorizado</label>
                          <InputText
                            className="w-100"
                            value={field.value || ""}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              handleBillingChange(
                                "authorizedAmount",
                                e.target.value
                              );
                            }}
                          />
                        </div>
                      )}
                    />
                  </div>
                )}
              </Card>
            </div>

            {/* <div className="col-lg-12 col-md-10 col-12 mb-4">
              <Card title="Acompañantes" className="h-100">
                <div className="d-flex align-items-center mb-3">
                  <InputSwitch
                    checked={formData.patient.hasCompanion}
                    onChange={(e) => toggleCompanion(e.value)}
                    className="me-3 bg-primary"
                  />
                  <label className="ml-2">Activar acompañante</label>
                </div>

                {formData.patient.hasCompanion && (
                  <div>
                    <span className="text-muted small">Información del acompañante</span>
                  </div>
                )}
              </Card>
            </div> */}
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-end pt-4 col-12">
        <Button
          label="Siguiente"
          icon={<i className="fas fa-arrow-right me-2"></i>}
          iconPos="right"
          onClick={handleNext}
          className="btn btn-primary btn-sm"
        />
      </div>
    </div>
  );
};

export default PatientStep;
