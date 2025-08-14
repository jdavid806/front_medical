import React, { useState, useRef, useEffect } from "react";
import { Steps } from "primereact/steps";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import PatientStep from "./steps/PatientStep";
import ProductsPaymentStep from "./steps/ProductsPaymentStep";
import PreviewDoneStep from "./steps/PreviewDoneStep";
import { calculateTotal, validatePatientStep, validatePaymentStep, validateProductsStep } from "./utils/helpers";

interface AdmissionBillingProps {
  visible: boolean;
  onHide: () => void;
  appointmentData?: any;
}

interface FormData {
  patient: {
    documentType: string;
    documentNumber: string;
    firstName: string;
    nameComplet: string; 
    middleName: string;
    lastName: string;
    secondLastName: string;
    birthDate: Date | null;
    gender: string;
    country: string;
    department: string;
    city: string;
    affiliateType?: string;
    insurance?: string;
    address: string;
    email: string;
    whatsapp: string;
    bloodType: string;
    hasCompanion: boolean;
    facturacionEntidad: boolean;
    facturacionConsumidor: boolean;
    [key: string]: any;
  };
  billing: {
    entity: string;
    authorizationDate: Date | null;
    authorizationNumber: string;
    authorizedAmount: string;
    consumerName: string;
    consumerDocument: string;
    consumerEmail: string;
    consumerPhone: string;
  };
  products: any[];
  payments: any[];
  currentPayment: {
    method: string;
    amount: string;
    authorizationNumber: string;
    notes: string;
  };
}

const initialFormState: FormData = {
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
  products: [
    { 
      id: 1, 
      code: "CON-001",
      description: "Consulta Endocrinologia", 
      price: 2000, 
      quantity: 1, 
      tax: 0,
      discount: 0,
      total: 2000 
    }
  ],
  payments: [],
  currentPayment: {
    method: "",
    amount: "",
    authorizationNumber: "",
    notes: ""
  }
};

const AdmissionBilling: React.FC<AdmissionBillingProps> = ({ visible, onHide, appointmentData }) => {
  const toast = useRef<Toast>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [formData, setFormData] = useState<FormData>(initialFormState);

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
        products: [
          {
            id: 1,
            code: appointmentData.product_id ? `CON-${appointmentData.product_id}` : "CON-001",
            description: `Consulta ${appointmentData.doctorName || ''}`,
            price: 2000,
            quantity: 1,
            tax: 0,
            discount: 0,
            total: 2000
          }
        ]
      });
    } else {
      setFormData(initialFormState);
    }
  }, [appointmentData, visible]);

  const updateFormData = <K extends keyof FormData>(section: K, data: Partial<FormData[K]>) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
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
    switch(index) {
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
    },
    { 
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
    },
    { 
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
          {activeIndex === 0 && (
            <PatientStep 
              formData={formData}
              updateFormData={updateFormData}
              nextStep={nextStep}
              toast={toast}
            />
          )}
          
          {activeIndex === 1 && (
            <ProductsPaymentStep 
              formData={formData} 
              updateFormData={updateFormData}
              addPayment={addPayment}
              removePayment={removePayment}
              nextStep={nextStep} 
              prevStep={prevStep} 
              toast={toast} 
            />
          )}
          
          {activeIndex === 2 && (
            <PreviewDoneStep 
              formData={formData} 
              prevStep={prevStep} 
              onHide={handleHide}
              onPrint={() => window.print()}
            />
          )}
        </div>
      </Dialog>
    </>
  );
};

export default AdmissionBilling;