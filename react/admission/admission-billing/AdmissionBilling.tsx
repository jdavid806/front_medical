import React, { useState, useRef, useEffect } from "react";
import { Steps } from "primereact/steps";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import PatientStep from "./steps/PatientStep";
import ProductsPaymentStep from "./steps/ProductsPaymentStep";
import PreviewDoneStep from "./steps/PreviewDoneStep";
import { calculateTotal, validatePatientStep, validatePaymentStep, validateProductsStep } from "./utils/helpers";
import { useProductsToBeInvoiced } from '../../appointments/hooks/useProductsToBeInvoiced'
import { AdmissionBillingFormData, BillingData } from "./interfaces/AdmisionBilling";
import { getUserLogged } from "../../../services/utilidades";
import { useAdmissionCreate } from "../hooks/useAdmissionCreate";

interface AdmissionBillingProps {
  visible: boolean;
  onHide: () => void;
  onSuccess?: () => void; // Nueva prop
  appointmentData?: any;
  productsToInvoice: any;
  productsLoading?: boolean
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

const AdmissionBilling: React.FC<AdmissionBillingProps> = ({
  visible,
  onHide,
  onSuccess, // Nueva prop
  appointmentData
}) => {
  const toast = useRef<Toast>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [formData, setFormData] = useState<AdmissionBillingFormData>(initialFormState);
  const [internalVisible, setInternalVisible] = useState(false);
  const isMounted = useRef(true);
  const [isSuccess, setIsSuccess] = useState(false);

  const idProduct = appointmentData?.id;
  const { products: productsToInvoice, loading: productsLoading } = useProductsToBeInvoiced(idProduct);
  const { createAdmission } = useAdmissionCreate();

  // Efecto para manejar la visibilidad y el estado de montaje
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

      console.log('✅ Admisión creada exitosamente:', response);

      if (!isMounted.current) return;

      toast.current?.show({
        severity: 'success',
        summary: 'Factura creada',
        detail: 'La factura se ha generado correctamente',
        life: 5000
      });

      if (isMounted.current) {
        setIsSuccess(true);
      }

      return response;
    } catch (error: any) {
      console.error('❌ Error submitting invoice:', error);

      if (!isMounted.current) return;

      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error?.message || 'Ocurrió un error al generar la factura. Por favor intente nuevamente.',
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

      if (isSuccess && onSuccess) {
        onSuccess();
      }

      onHide();
    }
  };

  useEffect(() => {
    if (!visible) return;
    console.log("📦 productsToInvoice actualizado:", productsToInvoice);

    if (appointmentData && appointmentData.patient) {
      const patient = appointmentData.patient;
      const initialProducts = productsToInvoice.length > 0
        ? productsToInvoice.map(product => {
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
          }
        })
        : [];

      console.log('initialProducts', initialProducts);

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
      }
    } else {
      if (isMounted.current) {
        setFormData(initialFormState);
      }
    }
  }, [appointmentData, visible, productsToInvoice]);

  const updateFormData = <K extends keyof AdmissionBillingFormData>(section: K, data: Partial<AdmissionBillingFormData[K]>) => {
    if (!isMounted.current) return;

    setFormData(prev => {
      return {
        ...prev,
        [section]: data
      };
    });
  };

  const updateBillingData = <K extends keyof BillingData>(field: K, value: any) => {
    if (!isMounted.current) return;

    setFormData(prev => ({
      ...prev,
      billing: {
        ...prev.billing,
        [field]: value
      }
    }));
  };

  const addPayment = (payment: any) => {
    if (!isMounted.current) return;

    setFormData(prev => ({
      ...prev,
      payments: [...prev.payments, {
        id: prev.payments.length + 1,
        ...payment
      }]
    }));
  };

  const removePayment = (id: number) => {
    if (!isMounted.current) return;

    setFormData(prev => ({
      ...prev,
      payments: prev.payments.filter(p => p.id !== id)
    }));
  };

  const validateCurrentStep = (index: number): boolean => {
    switch (index) {
      case 0:
        return validatePatientStep(formData.billing, toast);
      case 1:
        return validateProductsStep(formData.products, toast) &&
          validatePaymentStep(formData.payments, calculateTotal(formData.products, formData.billing.facturacionEntidad), toast);
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
      label: 'Datos del paciente',
      command: () => {
        setActiveIndex(0);
      }
    },
    {
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
    },
    {
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
    }
  ];

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        visible={internalVisible}
        onHide={handleHide}
        header="Nueva Factura"
        style={{ width: '100vw', maxWidth: '1600px' }}
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
              onPrint={() => window.print()}
              onSubmit={handleSubmitInvoice}
              isSuccess={isSuccess} 
              setIsSuccess={setIsSuccess} 
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default AdmissionBilling;