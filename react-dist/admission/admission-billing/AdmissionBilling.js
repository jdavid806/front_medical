import React, { useState, useRef, useEffect } from "react";
import { Steps } from "primereact/steps";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import PatientStep from "./steps/PatientStep.js";
import ProductsPaymentStep from "./steps/ProductsPaymentStep.js";
import PreviewDoneStep from "./steps/PreviewDoneStep.js";
import { calculateTotal, validatePatientStep, validatePaymentStep, validateProductsStep } from "./utils/helpers.js";
import { useProductsToBeInvoiced } from "../../appointments/hooks/useProductsToBeInvoiced.js";
import { getUserLogged } from "../../../services/utilidades.js";
const initialFormState = {
  patient: {
    id: "",
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
    affiliateType: "",
    insurance: "",
    entity_id: ""
  },
  billing: {
    entity: "",
    authorizationDate: null,
    authorizationNumber: "",
    authorizedAmount: "",
    consumerName: "",
    consumerDocument: "",
    consumerEmail: "",
    consumerPhone: "",
    facturacionEntidad: false,
    facturacionConsumidor: false
  },
  products: [],
  payments: [],
  currentPayment: {
    method: "",
    amount: 0,
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
  const idProduct = appointmentData?.id;
  const {
    products: productsToInvoice,
    loading: productsLoading
  } = useProductsToBeInvoiced(idProduct);
  const handleSubmitInvoice = async () => {
    try {
      console.log('📋 Datos del paciente:', {
        documentType: formData.patient.documentType,
        documentNumber: formData.patient.documentNumber,
        name: formData.patient.nameComplet,
        email: formData.patient.email,
        phone: formData.patient.whatsapp
      });
      console.log('💰 Datos de facturación:', {
        entityBilling: formData.billing.facturacionEntidad,
        consumerBilling: formData.billing.facturacionConsumidor,
        entity: formData.billing.entity,
        authorizationNumber: formData.billing.authorizationNumber
      });
      console.log('🛒 Productos:', formData.products.map(p => ({
        id: p.id,
        description: p.description,
        quantity: p.quantity,
        price: p.price,
        tax: p.tax
      })));
      console.log('💳 Pagos:', formData.payments.map(p => ({
        method: p.method,
        amount: p.amount,
        authorizationNumber: p.authorizationNumber
      })));
      console.log('🧮 Totales:', {
        subtotal: calculateTotal(formData.products, formData.billing.facturacionEntidad),
        taxes: formData.products.reduce((sum, product) => sum + product.price * product.quantity * product.tax / 100, 0),
        total: calculateTotal(formData.products, formData.billing.facturacionEntidad)
      });
      console.log('📅 Appointment ID:', appointmentData?.id);
      const userLogged = getUserLogged();
      const invoiceData = {
        external_id: `${userLogged.external_id}`,
        public_invoice: formData.billing.facturacionConsumidor,
        admission: {
          entity_id: formData.patient.entity_id,
          entity_authorized_amount: formData.billing.authorizedAmount.replace('.', '') || 0,
          authorization_number: formData.billing.facturacionEntidad ? formData.billing.authorizationNumber : "",
          authorization_date: formData.billing.facturacionEntidad && formData.billing.authorizationDate ? formData.billing.authorizationDate.toISOString().split('T')[0] : "",
          appointment_id: appointmentData?.id,
          koneksi_claim_id: null
        },
        invoice: {
          type: formData.billing.facturacionEntidad ? "entity" : "public",
          status: "Pagado",
          subtotal: calculateTotal(formData.products, formData.billing.facturacionEntidad),
          discount: 0,
          taxes: formData.products.reduce((sum, product) => sum + product.price * product.quantity * product.tax / 100, 0),
          total_amount: calculateTotal(formData.products, formData.billing.facturacionEntidad),
          observations: "",
          due_date: "",
          paid_amount: calculateTotal(formData.products, formData.billing.facturacionEntidad),
          user_id: userLogged.id,
          third_party_id: 1,
          sub_type: formData.billing.facturacionEntidad ? "entity" : "public"
        },
        invoice_detail: formData.products.map(product => ({
          product_id: product.id,
          description: product.description,
          quantity: product.quantity,
          unit_price: product.price,
          tax_rate: product.tax,
          discount: product.discount,
          total: product.total
        })),
        payments: formData.payments.map(payment => ({
          method: payment.method,
          amount: payment.amount,
          authorization_number: payment.authorizationNumber,
          notes: payment.notes
        }))
      };
      console.log('📤 Datos completos a enviar:', JSON.stringify(invoiceData, null, 2));
      console.log('🚀 Simulando envío al backend...');
      // await new Promise(resolve => setTimeout(resolve, 1500));

      toast.current?.show({
        severity: 'success',
        summary: 'Factura creada',
        detail: 'La factura se ha generado correctamente',
        life: 5000
      });
    } catch (error) {
      console.error('❌ Error submitting invoice:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Ocurrió un error al generar la factura. Por favor intente nuevamente.',
        life: 5000
      });
    }
  };
  const handleHide = () => {
    setFormData(initialFormState);
    setActiveIndex(0);
    setCompletedSteps([]);
    onHide();
  };
  useEffect(() => {
    if (!visible) return;
    console.log("📦 productsToInvoice actualizado:", productsToInvoice);
    if (appointmentData && appointmentData.patient) {
      const patient = appointmentData.patient;
      const initialProducts = productsToInvoice.length > 0 ? productsToInvoice.map(product => {
        const price = formData.billing.facturacionEntidad ? product.copayment : product.sale_price;
        return {
          uuid: `${Math.random().toString(36).slice(2, 8)}${Math.random().toString(36).slice(2, 8)}`,
          id: product.id,
          code: product.code || `PROD-${product.id}`,
          description: product.name || product.description || 'Producto sin nombre',
          price: product.sale_price,
          copayment: product.copayment,
          currentPrice: price,
          quantity: 1,
          tax: product.tax || 0,
          discount: 0,
          total: (price || 0) * (1 + (product.tax || 0) / 100)
        };
      }) : [];
      console.log('initialProducts', initialProducts);
      setFormData({
        ...initialFormState,
        patient: {
          ...initialFormState.patient,
          id: patient.id,
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
          hasCompanion: patient.companions?.length > 0 || false,
          entity_id: patient.social_security?.entity_id || ""
        },
        billing: {
          ...initialFormState.billing,
          entity: patient.social_security?.entity?.name || ""
        },
        products: initialProducts
      });
    } else {
      setFormData(initialFormState);
    }
  }, [appointmentData, visible, productsToInvoice]);
  const updateFormData = (section, data) => {
    setFormData(prev => {
      return {
        ...prev,
        [section]: data
      };
    });
  };
  const updateBillingData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      billing: {
        ...prev.billing,
        [field]: value
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
        return validatePatientStep(formData.billing, toast);
      case 1:
        return validateProductsStep(formData.products, toast) && validatePaymentStep(formData.payments, calculateTotal(formData.products, formData.billing.facturacionEntidad), toast);
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
      setActiveIndex(0);
    }
  }, {
    label: 'Productos y Pagos',
    command: () => {
      if (validateCurrentStep(0)) {
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
      if (validateCurrentStep(1)) {
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
  }, /*#__PURE__*/React.createElement("div", {
    className: activeIndex === 0 ? "" : "d-none"
  }, /*#__PURE__*/React.createElement(PatientStep, {
    formData: formData,
    updateFormData: updateFormData,
    updateBillingData: updateBillingData,
    nextStep: nextStep,
    toast: toast
  })), /*#__PURE__*/React.createElement("div", {
    className: activeIndex === 1 ? "" : "d-none"
  }, /*#__PURE__*/React.createElement(ProductsPaymentStep, {
    formData: formData,
    updateFormData: updateFormData,
    addPayment: addPayment,
    removePayment: removePayment,
    nextStep: nextStep,
    prevStep: prevStep,
    toast: toast,
    productsToInvoice: productsToInvoice
  })), /*#__PURE__*/React.createElement("div", {
    className: activeIndex === 2 ? "" : "d-none"
  }, /*#__PURE__*/React.createElement(PreviewDoneStep, {
    formData: formData,
    prevStep: prevStep,
    onHide: handleHide,
    onPrint: () => window.print(),
    onSubmit: handleSubmitInvoice
  })))));
};
export default AdmissionBilling;