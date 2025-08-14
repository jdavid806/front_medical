import React, { useState, useRef, useEffect } from "react";
import { Steps } from "primereact/steps";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import PatientStep from "./steps/PatientStep.js";
import ProductsPaymentStep from "./steps/ProductsPaymentStep.js";
import PreviewDoneStep from "./steps/PreviewDoneStep.js";
import { calculateTotal, validatePatientStep, validatePaymentStep, validateProductsStep } from "./utils/helpers.js";
const initialFormState = {
  patient: {
    documentType: "",
    documentNumber: "",
    firstName: "",
    nameComplet: "",
    middleName: "",
    lastName: "",
    secondLastName: "",
    birthDate: null,
    gender: "",
    country: "",
    department: "",
    city: "",
    address: "",
    email: "",
    whatsapp: "",
    bloodType: "",
    hasCompanion: false,
    facturacionEntidad: false,
    facturacionConsumidor: false
  },
  billing: {
    entity: "",
    authorizationDate: null,
    authorizationNumber: "",
    authorizedAmount: "",
    consumerName: "",
    consumerDocument: "",
    consumerEmail: "",
    consumerPhone: ""
  },
  products: [{
    id: 1,
    code: "CON-001",
    description: "Consulta Endocrinologia",
    price: 2000,
    quantity: 1,
    tax: 0,
    discount: 0,
    total: 2000
  }],
  payments: [],
  currentPayment: {
    method: "",
    amount: "",
    authorizationNumber: "",
    notes: ""
  }
};
const AdmissionBilling = ({
  visible,
  onHide,
  appointmentData
}) => {
  const toast = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const handleHide = () => {
    setFormData(initialFormState);
    setActiveIndex(0);
    setCompletedSteps([]);
    onHide();
  };
  useEffect(() => {
    if (!visible) return; // No hacer nada si el modal no está visible

    if (appointmentData && appointmentData.patient) {
      const patient = appointmentData.patient;
      console.log(patient, "paciente");
      setFormData({
        ...initialFormState,
        patient: {
          ...initialFormState.patient,
          documentType: patient.document_type || "",
          documentNumber: patient.document_number || "",
          firstName: patient.first_name || "",
          middleName: patient.middle_name || "",
          lastName: patient.last_name || "",
          secondLastName: patient.second_last_name || "",
          nameComplet: `${patient.first_name || ''} ${patient.middle_name || ''} ${patient.last_name || ''} ${patient.second_last_name || ''}`,
          birthDate: patient.date_of_birth ? new Date(patient.date_of_birth) : null,
          gender: patient.gender || "",
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
        },
        billing: {
          ...initialFormState.billing,
          entity: patient.social_security?.entity?.name || ""
        },
        products: [{
          id: 1,
          code: appointmentData.product_id ? `CON-${appointmentData.product_id}` : "CON-001",
          description: `Consulta ${appointmentData.doctorName || ''}`,
          price: 2000,
          quantity: 1,
          tax: 0,
          discount: 0,
          total: 2000
        }]
      });
    } else {
      setFormData(initialFormState);
    }
  }, [appointmentData, visible]);
  const updateFormData = (section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...data
      }
    }));
  };
  const addPayment = payment => {
    setFormData(prev => ({
      ...prev,
      payments: [...prev.payments, {
        id: prev.payments.length + 1,
        ...payment
      }]
    }));
  };
  const removePayment = id => {
    setFormData(prev => ({
      ...prev,
      payments: prev.payments.filter(p => p.id !== id)
    }));
  };
  const validateCurrentStep = index => {
    switch (index) {
      case 0:
        return validatePatientStep(formData.patient, toast);
      case 1:
        return validateProductsStep(formData.products, toast) && validatePaymentStep(formData.payments, calculateTotal(formData.products), toast);
      default:
        return true;
    }
  };
  const nextStep = async () => {
    if (!validateCurrentStep(activeIndex)) {
      return;
    }
    if (!completedSteps.includes(activeIndex)) {
      setCompletedSteps([...completedSteps, activeIndex]);
    }
    const nextIndex = activeIndex + 1;
    setActiveIndex(nextIndex);
  };
  const prevStep = () => {
    const prevIndex = activeIndex - 1;
    setActiveIndex(prevIndex);
  };
  const items = [{
    label: 'Datos del paciente',
    command: () => {
      if (completedSteps.includes(0)) {
        setActiveIndex(0);
      } else {
        toast.current?.show({
          severity: 'warn',
          summary: 'Paso no disponible',
          detail: 'Completa el paso actual primero',
          life: 3000
        });
      }
    }
  }, {
    label: 'Productos y Pagos',
    command: () => {
      if (completedSteps.includes(1)) {
        setActiveIndex(1);
      } else {
        toast.current?.show({
          severity: 'warn',
          summary: 'Paso no disponible',
          detail: 'Completa el paso actual primero',
          life: 3000
        });
      }
    }
  }, {
    label: 'Confirmación',
    command: () => {
      if (completedSteps.includes(2)) {
        setActiveIndex(2);
      } else {
        toast.current?.show({
          severity: 'warn',
          summary: 'Paso no disponible',
          detail: 'Completa el paso actual primero',
          life: 3000
        });
      }
    }
  }];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }), /*#__PURE__*/React.createElement(Dialog, {
    visible: visible,
    onHide: handleHide,
    header: "Nueva Factura",
    style: {
      width: '100vw',
      maxWidth: '1600px'
    },
    maximizable: true
  }, /*#__PURE__*/React.createElement(Steps, {
    model: items,
    activeIndex: activeIndex,
    readOnly: false,
    className: "mb-4"
  }), /*#__PURE__*/React.createElement("div", {
    className: "step-content"
  }, activeIndex === 0 && /*#__PURE__*/React.createElement(PatientStep, {
    formData: formData,
    updateFormData: updateFormData,
    nextStep: nextStep,
    toast: toast
  }), activeIndex === 1 && /*#__PURE__*/React.createElement(ProductsPaymentStep, {
    formData: formData,
    updateFormData: updateFormData,
    addPayment: addPayment,
    removePayment: removePayment,
    nextStep: nextStep,
    prevStep: prevStep,
    toast: toast
  }), activeIndex === 2 && /*#__PURE__*/React.createElement(PreviewDoneStep, {
    formData: formData,
    prevStep: prevStep,
    onHide: handleHide,
    onPrint: () => window.print()
  }))));
};
export default AdmissionBilling;