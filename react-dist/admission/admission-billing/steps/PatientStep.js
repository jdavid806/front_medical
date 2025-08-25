import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { validatePatientStep } from "../utils/helpers.js";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { InputSwitch } from "primereact/inputswitch";
import PatientFormModal from "../../../patients/modals/form/PatientFormModal.js";
import { usePatient } from "../../../patients/hooks/usePatient.js";
import { genders } from "../../../../services/commons.js";
const PatientStepPreview = ({
  formData,
  updateFormData,
  updateBillingData,
  nextStep,
  toast
}) => {
  const {
    control,
    handleSubmit,
    formState: {
      errors
    },
    trigger
  } = useForm({
    defaultValues: formData
  });
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [mappedPatient, setMappedPatient] = useState(null);
  const {
    patient,
    fetchPatient
  } = usePatient(formData.patient.id);
  useEffect(() => {
    if (patient) {
      const mappedPatientData = {
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
  const handlePatientChange = (field, value) => {
    updateFormData("patient", {
      [field]: value
    });
  };
  const handleBillingChange = (field, value) => {
    updateBillingData(field, value);
  };
  const toggleBillingType = type => {
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
  const toggleCompanion = value => {
    handlePatientChange("hasCompanion", value);
  };
  const handleNext = () => {
    console.log('formData', formData);
    if (validatePatientStep(formData.billing, toast)) {
      nextStep();
    }
  };
  const getFormErrorMessage = name => {
    const nameParts = name.split(".");
    let errorObj = errors;
    for (const part of nameParts) {
      errorObj = errorObj?.[part];
      if (!errorObj) break;
    }
    return errorObj && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, errorObj.message);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Datos Personales",
    className: "mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-2 d-flex flex-column gap-2"
  }, /*#__PURE__*/React.createElement("b", null, "Nombre"), mappedPatient?.nameComplet || "--"), /*#__PURE__*/React.createElement("div", {
    className: "mb-2 d-flex flex-column gap-2"
  }, /*#__PURE__*/React.createElement("b", null, "Documento"), mappedPatient?.documentNumber || "--")), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-2 d-flex flex-column gap-2"
  }, /*#__PURE__*/React.createElement("b", null, "G\xE9nero"), mappedPatient?.gender || "--"), /*#__PURE__*/React.createElement("div", {
    className: "mb-2 d-flex flex-column gap-2"
  }, /*#__PURE__*/React.createElement("b", null, "Direcci\xF3n"), mappedPatient?.address || "--")))), /*#__PURE__*/React.createElement(Card, {
    title: "Informaci\xF3n Adicional",
    className: "mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-2 d-flex flex-column gap-2"
  }, /*#__PURE__*/React.createElement("b", null, "WhatsApp"), mappedPatient?.whatsapp || "--"), /*#__PURE__*/React.createElement("div", {
    className: "mb-2 d-flex flex-column gap-2"
  }, /*#__PURE__*/React.createElement("b", null, "Correo"), mappedPatient?.email || "--"), /*#__PURE__*/React.createElement("div", {
    className: "mb-2 d-flex flex-column gap-2"
  }, /*#__PURE__*/React.createElement("b", null, "Aseguradora"), mappedPatient?.insurance || "--")), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-2 d-flex flex-column gap-2"
  }, /*#__PURE__*/React.createElement("b", null, "Ciudad"), mappedPatient?.city || "--"), /*#__PURE__*/React.createElement("div", {
    className: "mb-2 d-flex flex-column gap-2"
  }, /*#__PURE__*/React.createElement("b", null, "Tipo de afiliado"), mappedPatient?.affiliateType || "--"), /*#__PURE__*/React.createElement(Button, {
    label: "Actualizar Paciente",
    className: "btn btn-primary btn-sm",
    icon: "pi pi-user",
    onClick: () => setShowUpdateModal(true)
  })))), /*#__PURE__*/React.createElement("div", {
    className: "container-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row justify-content-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-lg-12 col-md-10 col-12 mb-4 w-40"
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Facturaci\xF3n Consumidor",
    className: "h-100"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center mb-3"
  }, /*#__PURE__*/React.createElement(InputSwitch, {
    checked: formData.billing.facturacionConsumidor,
    onChange: () => toggleBillingType("consumer"),
    className: "me-3 bg-primary"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-muted small"
  }, "facturaci\xF3n consumidor")))), /*#__PURE__*/React.createElement("div", {
    className: "col-lg-12 col-md-10 col-12 mb-4"
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Facturaci\xF3n por Entidad",
    className: "h-100"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center mb-3"
  }, /*#__PURE__*/React.createElement(InputSwitch, {
    checked: formData.billing.facturacionEntidad,
    onChange: () => toggleBillingType("entity"),
    className: "me-3 bg-primary"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-muted small"
  }, "Activar facturaci\xF3n por entidad")), formData.billing.facturacionEntidad && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Controller, {
    name: "billing.entity",
    control: control,
    rules: {
      required: "Entidad es requerida"
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement("div", {
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "Entidad *"), /*#__PURE__*/React.createElement(InputText, {
      className: classNames("w-100", {
        "p-invalid": fieldState.error
      }),
      value: field.value || "",
      onChange: e => {
        field.onChange(e.target.value);
        handleBillingChange("entity", e.target.value);
      },
      disabled: true
    }), getFormErrorMessage("billing.entity"))
  }), /*#__PURE__*/React.createElement(Controller, {
    name: "billing.authorizationDate",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement("div", {
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "Fecha de autorizaci\xF3n"), /*#__PURE__*/React.createElement(Calendar, {
      className: "w-100",
      value: field.value,
      onChange: e => {
        field.onChange(e.value);
        handleBillingChange("authorizationDate", e.value);
      },
      dateFormat: "dd/mm/yy",
      showIcon: true,
      appendTo: "self"
    }))
  }), /*#__PURE__*/React.createElement(Controller, {
    name: "billing.authorizationNumber",
    control: control,
    rules: {
      required: "Número de autorización es requerido"
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement("div", {
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "N\xB0 Autorizaci\xF3n *"), /*#__PURE__*/React.createElement(InputText, {
      className: classNames("w-100", {
        "p-invalid": fieldState.error
      }),
      value: field.value || "",
      onChange: e => {
        field.onChange(e.target.value);
        handleBillingChange("authorizationNumber", e.target.value);
      }
    }), getFormErrorMessage("billing.authorizationNumber"))
  }), /*#__PURE__*/React.createElement(Controller, {
    name: "billing.authorizedAmount",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement("div", {
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "Monto Autorizado"), /*#__PURE__*/React.createElement(InputText, {
      className: "w-100",
      value: field.value || "",
      onChange: e => {
        field.onChange(e.target.value);
        handleBillingChange("authorizedAmount", e.target.value);
      }
    }))
  }))))))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end pt-4 col-12"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Siguiente",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-arrow-right me-2"
    }),
    iconPos: "right",
    onClick: handleNext,
    className: "btn btn-primary btn-sm"
  })), /*#__PURE__*/React.createElement(PatientFormModal, {
    visible: showUpdateModal,
    onHide: () => setShowUpdateModal(false),
    onSuccess: () => {
      fetchPatient();
      setShowUpdateModal(false);
    },
    patientData: patient
  }));
};
export default PatientStepPreview;