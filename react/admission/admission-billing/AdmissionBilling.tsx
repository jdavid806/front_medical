import React, { useState, useRef, useEffect, useCallback } from "react";
import { Steps } from "primereact/steps";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import PatientStep from "./steps/PatientStep";
import ProductsPaymentStep from "./steps/ProductsPaymentStep";
import PreviewDoneStep from "./steps/PreviewDoneStep";
import {
  calculateTotal,
  validatePatientStep,
  validatePaymentStep,
  validateProductsStep,
} from "./utils/helpers";
import { useProductsToBeInvoiced } from "../../appointments/hooks/useProductsToBeInvoiced";
import {
  AdmissionBillingFormData,
  BillingData,
} from "./interfaces/AdmisionBilling";
import {
  formatDate,
  formatWhatsAppMessage,
  getIndicativeByCountry,
  getUserLogged,
} from "../../../services/utilidades";
import { useAdmissionCreate } from "../hooks/useAdmissionCreate";
import { useMassMessaging } from "../../hooks/useMassMessaging";
import { useTemplate } from "../../hooks/useTemplate";
import { SwalManager } from "../../../services/alertManagerImported";
import { generarFormato } from "../../../funciones/funcionesJS/generarPDF";

interface AdmissionBillingProps {
  visible: boolean;
  onHide: () => void;
  onSuccess?: () => void;
  appointmentData?: any;
  productsToInvoice: any;
  productsLoading?: boolean;
}

const initialFormState: AdmissionBillingFormData = {
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
    entity_id: "",
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
    facturacionConsumidor: false,
  },
  products: [],
  payments: [],
  currentPayment: {
    method: "",
    amount: 0,
    authorizationNumber: "",
    notes: "",
  },
};

const AdmissionBilling: React.FC<AdmissionBillingProps> = ({
  visible,
  onHide,
  onSuccess,
  appointmentData,
}) => {
  const toast = useRef<Toast>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [formData, setFormData] =
    useState<AdmissionBillingFormData>(initialFormState);
  const [responseAdmission, setResponseAdmission] = useState<any>(null);
  const [internalVisible, setInternalVisible] = useState(false);
  const isMounted = useRef(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [sendingWhatsApp, setSendingWhatsApp] = useState(false);

  const appointmentId = appointmentData?.id;
  const { products: productsToInvoice, loading: productsLoading } =
    useProductsToBeInvoiced(appointmentId);
  const { createAdmission } = useAdmissionCreate();
  const tenant = window.location.hostname.split(".")[0];
  const templateData = {
    tenantId: tenant,
    belongsTo: "facturacion-creacion",
    type: "whatsapp",
  };

  const { template, fetchTemplate } = useTemplate(templateData);
  const { sendMessage: sendMessageHook, loading: loadingMessage } =
    useMassMessaging();

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

  async function generatePdfFile(admissionData: any) {
    //@ts-ignore - Esta función debería existir en tu entorno
    await generarFormato(
      "Factura",
      admissionData,
      "Impresion",
      "admissionInput"
    );
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let fileInput: any = document.getElementById(
          "pdf-input-hidden-to-admissionInput"
        );
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
        guardarArchivo(formData, true)
          .then((response: any) => {
            resolve(response.file);
          })
          .catch(reject);
      }, 1000);
    });
  }

  const sendMessageWhatsapp = useCallback(
    async (admissionData: any) => {
      try {
        // Generar el PDF primero
        // @ts-ignore
        const dataToFile: any = await generatePdfFile(admissionData);
        //@ts-ignore - Esta función debería existir en tu entorno
        const urlPDF = getUrlImage(
          dataToFile.file_url.replaceAll("\\", "/"),
          true
        );

        if (!template) {
          await fetchTemplate();
        }

        const replacements = {
          NOMBRE_PACIENTE: `${
            admissionData.admission_data.patient.first_name ?? ""
          } ${admissionData.admission_data.patient.middle_name ?? ""} ${
            admissionData.admission_data.patient.last_name ?? ""
          } ${admissionData.admission_data.patient.second_last_name ?? ""}`,
          NUMERO_FACTURA:
            admissionData.data.invoice_code ||
            admissionData.data.invoice_reminder,
          FECHA_FACTURA: formatDate(
            admissionData.data_invoice.invoice.created_at
          ),
          MONTO_FACTURADO:
            "$" + admissionData.data_invoice.invoice.total_amount.toFixed(2),
          "ENLACE DOCUMENTO": "",
        };

        const templateFormatted = formatWhatsAppMessage(
          template?.template || "",
          replacements
        );

        const dataMessage = {
          channel: "whatsapp",
          recipients: [
            getIndicativeByCountry(formData.patient.country) +
              formData.patient.whatsapp,
          ],
          message_type: "media",
          message: templateFormatted,
          attachment_url: urlPDF,
          attachment_type: "document",
          minio_model_type: dataToFile?.model_type,
          minio_model_id: dataToFile?.model_id,
          minio_id: dataToFile?.id,
          webhook_url: "https://example.com/webhook",
        };

        await sendMessage.current(dataMessage);

        SwalManager.success({
          text: "Mensaje enviado correctamente",
          title: "Éxito",
        });
      } catch (error) {
        console.error("Error enviando mensaje por WhatsApp:", error);
        SwalManager.error({
          text: "Error al enviar el mensaje por WhatsApp",
          title: "Error",
        });
      }
    },
    [template, formData, sendMessage]
  );

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
        life: 5000,
      });

      if (response && response.data) {
        setResponseAdmission(response);
        await sendMessageWhatsapp(response);
      }

      if (isMounted.current) {
        setIsSuccess(true);
      }

      return response;
    } catch (error: any) {
      console.error("❌ Error submitting invoice:", error);

      if (!isMounted.current) return;

      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail:
          error?.message ||
          "Ocurrió un error al generar la factura. Por favor intente nuevamente.",
        life: 5000,
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
      const initialProducts =
        productsToInvoice.length > 0
          ? productsToInvoice.map((product) => {
              const price = formData.billing.facturacionEntidad
                ? product.copayment
                : product.sale_price;
              return {
                uuid: `${Math.random().toString(36).slice(2, 8)}${Math.random()
                  .toString(36)
                  .slice(2, 8)}`,
                id: product.id,
                code: product.code || `PROD-${product.id}`,
                description:
                  product.name || product.description || "Producto sin nombre",
                price: product.sale_price,
                copayment: product.copayment,
                currentPrice: price,
                quantity: 1,
                tax: product.tax || 0,
                discount: 0,
                total: (price || 0) * (1 + (product.tax || 0) / 100),
                entities: product.entities || [],
                matchProductByEntity:
                  product.entities?.find(
                    (item: any) =>
                      item?.entity_id === patient?.social_security?.entity_id &&
                      item?.negotation_type.toLowerCase() ===
                        patient?.social_security?.affiliate_type.toLowerCase()
                  ) || null,
              };
            })
          : [];

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
            nameComplet: `${patient.first_name || ""} ${
              patient.middle_name || ""
            } ${patient.last_name || ""} ${patient.second_last_name || ""}`,
            birthDate: patient.date_of_birth
              ? new Date(patient.date_of_birth)
              : null,
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
            entity_id: patient.social_security?.entity_id || "",
          },
          billing: {
            ...initialFormState.billing,
            entity: patient.social_security?.entity?.name || "",
          },
          products: initialProducts,
        });
      }
    } else {
      if (isMounted.current) {
        setFormData(initialFormState);
      }
    }
  }, [appointmentData, visible, productsToInvoice]);

  const updateFormData = <K extends keyof AdmissionBillingFormData>(
    section: K,
    data: Partial<AdmissionBillingFormData[K]>
  ) => {
    if (!isMounted.current) return;

    setFormData((prev) => {
      return {
        ...prev,
        [section]: data,
      };
    });
  };

  const updateBillingData = <K extends keyof BillingData>(
    field: K,
    value: any
  ) => {
    if (!isMounted.current) return;

    setFormData((prev) => ({
      ...prev,
      billing: {
        ...prev.billing,
        [field]: value,
      },
    }));
  };

  const addPayment = (payment: any) => {
    if (!isMounted.current) return;

    setFormData((prev) => ({
      ...prev,
      payments: [
        ...prev.payments,
        {
          id: prev.payments.length + 1,
          ...payment,
        },
      ],
    }));
  };

  const removePayment = (id: number) => {
    if (!isMounted.current) return;

    setFormData((prev) => ({
      ...prev,
      payments: prev.payments.filter((p) => p.id !== id),
    }));
  };

  const validateCurrentStep = (index: number): boolean => {
    switch (index) {
      case 0:
        return validatePatientStep(formData.billing, toast);
      case 1:
        return (
          validateProductsStep(formData.products, toast) &&
          validatePaymentStep(
            formData.payments,
            calculateTotal(
              formData.products,
              formData.billing.facturacionEntidad
            ),
            toast
          )
        );
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

  const items = [
    {
      label: "Datos del paciente",
      command: () => {
        setActiveIndex(0);
      },
    },
    {
      label: "Productos y Pagos",
      command: () => {
        if (validateCurrentStep(0)) {
          setActiveIndex(1);
        } else {
          toast.current?.show({
            severity: "warn",
            summary: "Paso no disponible",
            detail: "Completa el paso actual primero",
            life: 3000,
          });
        }
      },
    },
    {
      label: "Confirmación",
      command: () => {
        if (validateCurrentStep(1)) {
          setActiveIndex(2);
        } else {
          toast.current?.show({
            severity: "warn",
            summary: "Paso no disponible",
            detail: "Completa el paso actual primero",
            life: 3000,
          });
        }
      },
    },
  ];

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        visible={internalVisible}
        onHide={handleHide}
        header="Nueva Factura"
        style={{ width: "100vw", maxWidth: "1600px" }}
        maximizable
      >
        <Steps
          model={items}
          activeIndex={activeIndex}
          readOnly={false}
          className="mb-4"
        />

        <div className="step-content">
          <div className={activeIndex === 0 ? "" : "d-none"}>
            <PatientStep
              formData={formData}
              updateFormData={updateFormData}
              updateBillingData={updateBillingData}
              nextStep={nextStep}
              toast={toast}
            />
          </div>

          <div className={activeIndex === 1 ? "" : "d-none"}>
            <ProductsPaymentStep
              formData={formData}
              updateFormData={updateFormData}
              addPayment={addPayment}
              removePayment={removePayment}
              nextStep={nextStep}
              prevStep={prevStep}
              toast={toast}
              productsToInvoice={productsToInvoice}
            />
          </div>

          <div className={activeIndex === 2 ? "" : "d-none"}>
            <PreviewDoneStep
              formData={formData}
              prevStep={prevStep}
              onHide={handleHide}
              onDownload={async () => {
                //@ts-ignore
                await generateInvoice(appointmentId, true);
              }}
              onPrint={async () => {
                //@ts-ignore
                await generateInvoice(appointmentId, false);
              }}
              onSubmit={handleSubmitInvoice}
              isSuccess={isSuccess}
              setIsSuccess={setIsSuccess}
              onSendWhatsApp={handleSendWhatsApp}
              sendingWhatsApp={sendingWhatsApp}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default AdmissionBilling;
