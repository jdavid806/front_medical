import React, { useState, useRef, useEffect, useCallback } from "react";
import { Stepper } from 'primereact/stepper';
import { Card } from 'primereact/card';
import { ProgressBar } from 'primereact/progressbar';
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { Badge } from "primereact/badge";
import { Button } from 'primereact/button';
import PatientStep from "./steps/PatientStep.js";
import ProductsPaymentStep from "./steps/ProductsPaymentStep.js";
import PreviewDoneStep from "./steps/PreviewDoneStep.js";
import { calculateTotal, validatePatientStep, validatePaymentStep, validateProductsStep } from "./utils/helpers.js";
import { useProductsToBeInvoiced } from "../../appointments/hooks/useProductsToBeInvoiced.js";
import { formatDate, formatWhatsAppMessage, getIndicativeByCountry } from "../../../services/utilidades.js";
import { useAdmissionCreate } from "../hooks/useAdmissionCreate.js";
import { useMassMessaging } from "../../hooks/useMassMessaging.js";
import { useTemplate } from "../../hooks/useTemplate.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
import { generarFormato } from "../../../funciones/funcionesJS/generarPDF.js";
import { StepperPanel } from "primereact/stepperpanel";
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
  onSuccess,
  appointmentData
}) => {
  const toast = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [responseAdmission, setResponseAdmission] = useState(null);
  const [internalVisible, setInternalVisible] = useState(false);
  const isMounted = useRef(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [sendingWhatsApp, setSendingWhatsApp] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const appointmentId = appointmentData?.id;
  const {
    products: productsToInvoice,
    loading: productsLoading
  } = useProductsToBeInvoiced(appointmentId);
  const {
    createAdmission
  } = useAdmissionCreate();
  const tenant = window.location.hostname.split(".")[0];
  const templateData = {
    tenantId: tenant,
    belongsTo: "facturacion-creacion",
    type: "whatsapp"
  };
  const {
    template,
    fetchTemplate
  } = useTemplate(templateData);
  const {
    sendMessage: sendMessageHook,
    loading: loadingMessage
  } = useMassMessaging();
  const sendMessage = useRef(sendMessageHook);
  useEffect(() => {
    sendMessage.current = sendMessageHook;
  }, [sendMessageHook]);
  const handleSendWhatsApp = async () => {
    setSendingWhatsApp(true);
    try {
      await sendMessageWhatsapp(responseAdmission);
    } catch (error) {
      console.error("Error enviando WhatsApp:", error);
    } finally {
      setSendingWhatsApp(false);
    }
  };
  async function generatePdfFile(admissionData) {
    //@ts-ignore - Esta función debería existir en tu entorno
    await generarFormato("Factura", admissionData, "Impresion", "admissionInput");
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let fileInput = document.getElementById("pdf-input-hidden-to-admissionInput");
        let file = fileInput?.files[0];
        if (!file) {
          resolve(null);
          return;
        }
        let formData = new FormData();
        formData.append("file", file);
        formData.append("model_type", "App\\Models\\Admission");
        formData.append("model_id", admissionData.admission_data.id);
        //@ts-ignore - Esta función debería existir en tu entorno
        guardarArchivo(formData, true).then(response => {
          resolve(response.file);
        }).catch(reject);
      }, 1000);
    });
  }
  const sendMessageWhatsapp = useCallback(async admissionData => {
    try {
      // Generar el PDF primero
      // @ts-ignore
      const dataToFile = await generatePdfFile(admissionData);
      //@ts-ignore - Esta función debería existir en tu entorno
      const urlPDF = getUrlImage(dataToFile.file_url.replaceAll("\\", "/"), true);
      if (!template) {
        await fetchTemplate();
      }
      const replacements = {
        NOMBRE_PACIENTE: `${admissionData.admission_data.patient.first_name ?? ""} ${admissionData.admission_data.patient.middle_name ?? ""} ${admissionData.admission_data.patient.last_name ?? ""} ${admissionData.admission_data.patient.second_last_name ?? ""}`,
        NUMERO_FACTURA: admissionData.data.invoice_code || admissionData.data.invoice_reminder,
        FECHA_FACTURA: formatDate(admissionData.data_invoice.invoice.created_at),
        MONTO_FACTURADO: "$" + admissionData.data_invoice.invoice.total_amount.toFixed(2),
        "ENLACE DOCUMENTO": ""
      };
      const templateFormatted = formatWhatsAppMessage(template?.template || "", replacements);
      const dataMessage = {
        channel: "whatsapp",
        recipients: [getIndicativeByCountry(formData.patient.country) + formData.patient.whatsapp],
        message_type: "media",
        message: templateFormatted,
        attachment_url: urlPDF,
        attachment_type: "document",
        minio_model_type: dataToFile?.model_type,
        minio_model_id: dataToFile?.model_id,
        minio_id: dataToFile?.id,
        webhook_url: "https://example.com/webhook"
      };
      await sendMessage.current(dataMessage);
      SwalManager.success({
        text: "Mensaje enviado correctamente",
        title: "Éxito"
      });
    } catch (error) {
      console.error("Error enviando mensaje por WhatsApp:", error);
      SwalManager.error({
        text: "Error al enviar el mensaje por WhatsApp",
        title: "Error"
      });
    }
  }, [template, formData, sendMessage]);
  useEffect(() => {
    isMounted.current = true;
    setInternalVisible(visible);
    return () => {
      isMounted.current = false;
    };
  }, [visible]);
  const handleSubmitInvoice = async () => {
    try {
      const response = await createAdmission(formData, appointmentData);
      if (!isMounted.current) return;
      toast.current?.show({
        severity: "success",
        summary: "Factura creada",
        detail: "La factura se ha generado correctamente",
        life: 5000
      });
      if (response && response.data) {
        setResponseAdmission(response);
        await sendMessageWhatsapp(response);
      }
      if (isMounted.current) {
        setIsSuccess(true);
      }
      return response;
    } catch (error) {
      console.error("❌ Error submitting invoice:", error);
      if (!isMounted.current) return;
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error?.message || "Ocurrió un error al generar la factura. Por favor intente nuevamente.",
        life: 5000
      });
      throw error;
    }
  };
  const handleHide = () => {
    if (isMounted.current) {
      setFormData(initialFormState);
      setActiveIndex(0);
      setCompletedSteps([]);
      setInternalVisible(false);
      setIsSuccess(false);
      setSidebarExpanded(true);
      if (isSuccess && onSuccess) {
        onSuccess();
      }
      onHide();
    }
  };
  useEffect(() => {
    if (!visible) return;
    if (appointmentData && appointmentData.patient) {
      const patient = appointmentData.patient;
      const initialProducts = productsToInvoice.length > 0 ? productsToInvoice.map(product => {
        const price = formData.billing.facturacionEntidad ? product.copayment : product.sale_price;
        return {
          uuid: `${Math.random().toString(36).slice(2, 8)}${Math.random().toString(36).slice(2, 8)}`,
          id: product.id,
          code: product.code || `PROD-${product.id}`,
          description: product.name || product.description || "Producto sin nombre",
          price: product.sale_price,
          copayment: product.copayment,
          currentPrice: price,
          quantity: 1,
          tax: product.tax || 0,
          discount: 0,
          total: (price || 0) * (1 + (product.tax || 0) / 100),
          entities: product.entities || [],
          matchProductByEntity: product.entities?.find(item => item?.entity_id === patient?.social_security?.entity_id && item?.negotation_type?.toLowerCase() === patient?.social_security?.affiliate_type.toLowerCase()) || null
        };
      }) : [];

      // Verificar montaje antes de actualizar estado
      if (isMounted.current) {
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
            nameComplet: `${patient.first_name || ""} ${patient.middle_name || ""} ${patient.last_name || ""} ${patient.second_last_name || ""}`,
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
      }
    } else {
      if (isMounted.current) {
        setFormData(initialFormState);
      }
    }
  }, [appointmentData, visible, productsToInvoice]);
  const updateFormData = (section, data) => {
    if (!isMounted.current) return;
    setFormData(prev => {
      return {
        ...prev,
        [section]: data
      };
    });
  };
  const updateBillingData = (field, value) => {
    if (!isMounted.current) return;
    setFormData(prev => ({
      ...prev,
      billing: {
        ...prev.billing,
        [field]: value
      }
    }));
  };
  const addPayment = payment => {
    if (!isMounted.current) return;
    setFormData(prev => ({
      ...prev,
      payments: [...prev.payments, {
        id: prev.payments.length + 1,
        ...payment
      }]
    }));
  };
  const removePayment = id => {
    if (!isMounted.current) return;
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
  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };
  const billingSteps = [{
    id: 'patient',
    label: "Datos del Paciente",
    icon: "pi pi-user"
  }, {
    id: 'products-payments',
    label: "Productos y Pagos",
    icon: "pi pi-shopping-cart"
  }, {
    id: 'confirmation',
    label: "Confirmación",
    icon: "pi pi-check-circle"
  }];
  const progressValue = (activeIndex + 1) / billingSteps.length * 100;
  const renderCurrentComponent = () => {
    switch (activeIndex) {
      case 0:
        return /*#__PURE__*/React.createElement(PatientStep, {
          formData: formData,
          updateFormData: updateFormData,
          updateBillingData: updateBillingData,
          nextStep: nextStep,
          toast: toast
        });
      case 1:
        return /*#__PURE__*/React.createElement(ProductsPaymentStep, {
          formData: formData,
          updateFormData: updateFormData,
          addPayment: addPayment,
          removePayment: removePayment,
          nextStep: nextStep,
          prevStep: prevStep,
          toast: toast,
          productsToInvoice: productsToInvoice
        });
      case 2:
        return /*#__PURE__*/React.createElement(PreviewDoneStep, {
          formData: formData,
          prevStep: prevStep,
          onHide: handleHide,
          onDownload: async () => {
            //@ts-ignore
            await generateInvoice(appointmentId, true);
          },
          onPrint: async () => {
            //@ts-ignore
            await generateInvoice(appointmentId, false);
          },
          onSubmit: handleSubmitInvoice,
          isSuccess: isSuccess,
          setIsSuccess: setIsSuccess,
          onSendWhatsApp: handleSendWhatsApp,
          sendingWhatsApp: sendingWhatsApp
        });
      default:
        return null;
    }
  };
  const isNextDisabled = () => {
    return !validateCurrentStep(activeIndex);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }), /*#__PURE__*/React.createElement(Dialog, {
    visible: internalVisible,
    onHide: handleHide,
    header: "Nueva Factura",
    style: {
      width: "85vw",
      maxWidth: "1400px"
    },
    maximizable: true,
    className: "admission-billing-dialog",
    breakpoints: {
      '960px': '75vw',
      '641px': '90vw'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "container-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement(Card, {
    className: "shadow-sm admission-billing-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: `${sidebarExpanded ? 'col-lg-3 col-md-4' : 'col-lg-1 col-md-2'} border-end transition-all transition-duration-300`
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-3 h-100 bg-light position-relative"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-3"
  }, sidebarExpanded && /*#__PURE__*/React.createElement("h6", {
    className: "text-primary mb-0 fw-bold"
  }, "Pasos de Facturaci\xF3n"), /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center gap-2"
  }, sidebarExpanded && /*#__PURE__*/React.createElement(Badge, {
    value: `${activeIndex + 1}/${billingSteps.length}`,
    severity: "info"
  }), /*#__PURE__*/React.createElement(Button, {
    onClick: toggleSidebar,
    className: "p-button-primary",
    title: sidebarExpanded ? "Contraer panel" : "Expandir panel"
  }, /*#__PURE__*/React.createElement("i", {
    className: sidebarExpanded ? "fas fa-chevron-left" : "fas fa-chevron-right"
  })))), sidebarExpanded ? /*#__PURE__*/React.createElement(Stepper, {
    activeStep: activeIndex,
    orientation: "vertical",
    linear: false,
    className: "vertical-stepper overflow-auto",
    readOnly: true
  }, billingSteps.map((step, index) => /*#__PURE__*/React.createElement(StepperPanel, {
    key: step.id,
    header: step.label,
    icon: /*#__PURE__*/React.createElement("i", {
      className: step.icon
    })
  }))) : /*#__PURE__*/React.createElement("div", {
    className: "text-center"
  }, /*#__PURE__*/React.createElement(Badge, {
    value: activeIndex + 1,
    severity: "info",
    className: "mb-2",
    style: {
      fontSize: '1.2rem',
      minWidth: '30px',
      height: '30px'
    }
  }), /*#__PURE__*/React.createElement("small", {
    className: "text-muted d-block"
  }, "Paso ", activeIndex + 1), /*#__PURE__*/React.createElement("small", {
    className: "text-muted d-block"
  }, "de ", billingSteps.length)))), /*#__PURE__*/React.createElement("div", {
    className: `${sidebarExpanded ? 'col-lg-9 col-md-8' : 'col-lg-11 col-md-10'} transition-all transition-duration-300`
  }, /*#__PURE__*/React.createElement("div", {
    className: "configuration-content p-4 card border-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "progress-section mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-2"
  }, /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, "Paso ", activeIndex + 1, " de ", billingSteps.length), /*#__PURE__*/React.createElement("small", {
    className: "text-primary fw-bold"
  }, Math.round(progressValue), "% completado")), /*#__PURE__*/React.createElement(ProgressBar, {
    value: progressValue,
    showValue: false,
    style: {
      height: '10px',
      borderRadius: '5px'
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "content-body mb-4"
  }, renderCurrentComponent()))))))))));
};
export default AdmissionBilling;