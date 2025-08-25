import React, { useEffect, useState } from "react";
import { AdmissionBillingFormData, BillingData, PatientData, PatientStepProps } from "../interfaces/AdmisionBilling";
import { Controller, useForm } from "react-hook-form";
import { validatePatientStep } from "../utils/helpers";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { InputSwitch } from "primereact/inputswitch";
import { genderOptions } from "../utils/constants";
import PatientFormModal from "../../../patients/modals/form/PatientFormModal";
import { Patient } from "../../../models/models";
import { usePatient } from "../../../patients/hooks/usePatient";
import { genders } from "../../../../services/commons";

const PatientStepPreview: React.FC<PatientStepProps> = ({
  formData,
  updateFormData,
  updateBillingData,
  nextStep,
  toast,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<AdmissionBillingFormData>({
    defaultValues: formData,
  });
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [mappedPatient, setMappedPatient] = useState<Partial<PatientData> | null>(null);
  const { patient, fetchPatient } = usePatient(formData.patient.id);

  useEffect(() => {
    if (patient) {
      const mappedPatientData: Partial<PatientData> = {
        id: patient.id,
        documentType: patient.document_type || "",
        documentNumber: patient.document_number || "",
        firstName: patient.first_name || "",
        middleName: patient.middle_name || "",
        lastName: patient.last_name || "",
        secondLastName: patient.second_last_name || "",
        nameComplet: `${patient.first_name || ''} ${patient.middle_name || ''} ${patient.last_name || ''} ${patient.second_last_name || ''}`,
        birthDate: patient.date_of_birth ? new Date(patient.date_of_birth) : null,
        gender: genders[patient.gender] || "",
        country: patient.country_id || "",
        department: patient.department_id || "",
        city: patient.city_id || "",
        address: patient.address || "",
        email: patient.email || "",
        whatsapp: patient.whatsapp || "",
        bloodType: patient.blood_type || "",
        affiliateType: patient.social_security?.affiliate_type || "",
        insurance: patient.social_security?.entity?.name || "",
        hasCompanion: patient.companions?.length > 0 || false
      };
      setMappedPatient(mappedPatientData);
    }
  }, [patient]);

  const handlePatientChange = <K extends keyof PatientData>(
    field: K,
    value: any
  ) => {
    updateFormData("patient", { [field]: value });
  };

  const handleBillingChange = <K extends keyof BillingData>(
    field: K,
    value: any
  ) => {
    updateBillingData(field, value);
  };

  const toggleBillingType = (type: "entity" | "consumer") => {
    if (type === "entity") {
      updateBillingData("facturacionEntidad", !formData.billing.facturacionEntidad);
      updateBillingData("facturacionConsumidor", false);
      formData.billing.facturacionEntidad = !formData.billing.facturacionEntidad;
      formData.billing.facturacionConsumidor = false;
    } else {
      updateBillingData("facturacionConsumidor", !formData.billing.facturacionConsumidor);
      updateBillingData("facturacionEntidad", false);
      formData.billing.facturacionConsumidor = !formData.billing.facturacionConsumidor;
      formData.billing.facturacionEntidad = false;
    }
    console.log(!formData.billing.facturacionEntidad);

    const mappedProducts = formData.products.map(product => ({
      ...product,
      currentPrice: formData.billing.facturacionEntidad ? product.copayment : product.price
    }));
    console.log(mappedProducts);

    formData.products = mappedProducts;
    updateFormData("products", mappedProducts);
    updateFormData("payments", []);
  };

  const toggleCompanion = (value: boolean) => {
    handlePatientChange("hasCompanion", value);
  };

  const handleNext = () => {
    console.log('formData', formData);
    if (validatePatientStep(formData.billing, toast)) {
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
              <div className="mb-2 d-flex flex-column gap-2">
                <b>Nombre</b>
                {mappedPatient?.nameComplet || "--"}
              </div>
              <div className="mb-2 d-flex flex-column gap-2">
                <b>Documento</b>
                {mappedPatient?.documentNumber || "--"}
              </div>
            </div>

            <div className="col-md-6">
              <div className="mb-2 d-flex flex-column gap-2">
                <b>Género</b>
                {mappedPatient?.gender || "--"}
              </div>
              <div className="mb-2 d-flex flex-column gap-2">
                <b>Dirección</b>
                {mappedPatient?.address || "--"}
              </div>
            </div>
          </div>
        </Card>

        <Card title="Información Adicional" className="mb-4">
          <div className="row">
            <div className="col-md-6">
              <div className="mb-2 d-flex flex-column gap-2">
                <b>WhatsApp</b>
                {mappedPatient?.whatsapp || "--"}
              </div>
              <div className="mb-2 d-flex flex-column gap-2">
                <b>Correo</b>
                {mappedPatient?.email || "--"}
              </div>
              <div className="mb-2 d-flex flex-column gap-2">
                <b>Aseguradora</b>
                {mappedPatient?.insurance || "--"}
              </div>
            </div>

            <div className="col-md-6">
              <div className="mb-2 d-flex flex-column gap-2">
                <b>Ciudad</b>
                {mappedPatient?.city || "--"}
              </div>
              <div className="mb-2 d-flex flex-column gap-2">
                <b>Tipo de afiliado</b>
                {mappedPatient?.affiliateType || "--"}
              </div>
              <Button
                label="Actualizar Paciente"
                className="btn btn-primary btn-sm"
                icon="pi pi-user"
                onClick={() => setShowUpdateModal(true)}
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
                    checked={formData.billing.facturacionConsumidor}
                    onChange={() => toggleBillingType("consumer")}
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
                    checked={formData.billing.facturacionEntidad}
                    onChange={() => toggleBillingType("entity")}
                    className="me-3 bg-primary"
                  />
                  <span className="text-muted small">
                    Activar facturación por entidad
                  </span>
                </div>

                {formData.billing.facturacionEntidad && (
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
                            disabled
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
      <PatientFormModal
        visible={showUpdateModal}
        onHide={() => setShowUpdateModal(false)}
        onSuccess={() => {
          fetchPatient();
          setShowUpdateModal(false);
        }}
        patientData={patient}
      />
    </div>
  );
};

export default PatientStepPreview;