import React, { useState, useRef, useEffect } from "react";
import { Steps } from "primereact/steps";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import PatientStep from "./steps/PatientStep";
import ProductsPaymentStep from "./steps/ProductsPaymentStep";
import PreviewDoneStep from "./steps/PreviewDoneStep";
import { calculateTotal, validatePatientStep, validatePaymentStep, validateProductsStep } from "./utils/helpers";
import { useProductsToBeInvoiced } from '../../appointments/hooks/useProductsToBeInvoiced'
import { AdmissionBillingFormData } from "./interfaces/AdmisionBilling";
interface AdmissionBillingProps {
  visible: boolean;
  onHide: () => void;
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
    facturacionEntidad: false,
    facturacionConsumidor: false,
    affiliateType: "",
    insurance: ""
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
  products: [],
  payments: [],
  currentPayment: {
    method: "",
    amount: 0,
    authorizationNumber: "",
    notes: ""
  }
};

const AdmissionBilling: React.FC<AdmissionBillingProps> = ({ visible, onHide, appointmentData }) => {
  const toast = useRef<Toast>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [formData, setFormData] = useState<AdmissionBillingFormData>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [invoiceNumber] = useState(`FAC-${Math.floor(Math.random() * 10000)}`);


  const idProduct = appointmentData?.id;
  const { products: productsToInvoice, loading: productsLoading } = useProductsToBeInvoiced(idProduct);

  const handleSubmitInvoice = async () => {
    setIsSubmitting(true);

    try {
      console.log('📋 Datos del paciente:', {
        documentType: formData.patient.documentType,
        documentNumber: formData.patient.documentNumber,
        name: formData.patient.nameComplet,
        email: formData.patient.email,
        phone: formData.patient.whatsapp
      });

      console.log('💰 Datos de facturación:', {
        entityBilling: formData.patient.facturacionEntidad,
        consumerBilling: formData.patient.facturacionConsumidor,
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
        subtotal: calculateTotal(formData.products),
        taxes: formData.products.reduce((sum, product) => sum + (product.price * product.quantity * product.tax / 100), 0),
        total: calculateTotal(formData.products)
      });

      console.log('📅 Appointment ID:', appointmentData?.id);

      const invoiceData = {
        patient: {
          documentType: formData.patient.documentType,
          documentNumber: formData.patient.documentNumber,
          name: formData.patient.nameComplet,
          email: formData.patient.email,
          phone: formData.patient.whatsapp,
          address: formData.patient.address,
          city: formData.patient.city,
          insurance: formData.patient.insurance,
          affiliateType: formData.patient.affiliateType
        },
        billing: {
          entityBilling: formData.patient.facturacionEntidad,
          consumerBilling: formData.patient.facturacionConsumidor,
          entity: formData.billing.entity,
          authorizationNumber: formData.billing.authorizationNumber,
          authorizationDate: formData.billing.authorizationDate,
          authorizedAmount: formData.billing.authorizedAmount
        },
        items: formData.products.map(product => ({
          productId: product.id,
          description: product.description,
          quantity: product.quantity,
          unitPrice: product.price,
          taxRate: product.tax,
          discount: product.discount,
          total: product.total
        })),
        payments: formData.payments.map(payment => ({
          method: payment.method,
          amount: payment.amount,
          authorizationNumber: payment.authorizationNumber,
          notes: payment.notes
        })),
        totals: {
          subtotal: calculateTotal(formData.products),
          taxes: formData.products.reduce((sum, product) => sum + (product.price * product.quantity * product.tax / 100), 0),
          discount: formData.products.reduce((sum, product) => sum + product.discount, 0),
          total: calculateTotal(formData.products)
        },
        appointmentId: appointmentData?.id,
        invoiceNumber: invoiceNumber,
        status: 'completed'
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

      setIsDone(true);
    } catch (error) {
      console.error('❌ Error submitting invoice:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Ocurrió un error al generar la factura. Por favor intente nuevamente.',
        life: 5000
      });
    } finally {
      setIsSubmitting(false);
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
      const initialProducts = productsToInvoice.length > 0
        ? productsToInvoice.map(product => ({
          uuid: `${Math.random().toString(36).slice(2, 8)}${Math.random().toString(36).slice(2, 8)}`,
          id: product.id,
          code: product.code || `PROD-${product.id}`,
          description: product.name || product.description || 'Producto sin nombre',
          price: product.sale_price || 0,
          quantity: 1,
          tax: product.tax || 0,
          discount: 0,
          total: (product.sale_price || 0) * (1 + (product.tax || 0) / 100)
        }))
        : [];

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
          hasCompanion: patient.companions?.length > 0 || false
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

  const updateFormData = <K extends keyof AdmissionBillingFormData>(section: K, data: Partial<AdmissionBillingFormData[K]>) => {
    setFormData(prev => {
      const updatedData = section === 'products' && !Array.isArray(data)
        ? Object.values(data || {})
        : data;

      return {
        ...prev,
        [section]: updatedData
      };
    });
  };

  const addPayment = (payment: any) => {
    setFormData(prev => ({
      ...prev,
      payments: [...prev.payments, {
        id: prev.payments.length + 1,
        ...payment
      }]
    }));
  };

  const removePayment = (id: number) => {
    setFormData(prev => ({
      ...prev,
      payments: prev.payments.filter(p => p.id !== id)
    }));
  };

  const validateCurrentStep = (index: number): boolean => {
    switch (index) {
      case 0:
        return validatePatientStep(formData.patient, toast);
      case 1:
        return validateProductsStep(formData.products, toast) &&
          validatePaymentStep(formData.payments, calculateTotal(formData.products), toast);
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
        visible={visible}
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
            />
          </div>

          <div className={activeIndex === 2 ? "" : "d-none"}>
            <PreviewDoneStep
              formData={formData}
              prevStep={prevStep}
              onHide={handleHide}
              onPrint={() => window.print()}
              onSubmit={handleSubmitInvoice}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default AdmissionBilling;