import React, { useState, useRef, useEffect } from "react";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import PatientStep from "./steps/PatientStep";
import { AdmissionBillingProps, FormData} from "./interfaces/AdmisionBilling";
import ProductsPaymentStep from "./steps/ProductsPaymentStep";
import PreviewDoneStep from "./steps/PreviewDoneStep";

const AdmissionBilling: React.FC<AdmissionBillingProps> = ({ visible, onHide, appointmentData }) => {
  const stepperRef = useRef(null);
  const toast = useRef<Toast>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  
  const [formData, setFormData] = useState<FormData>({
    patient: {
      documentType: "",
      documentNumber: "",
      firstName: "",
      middleName: "",
      lastName: "",
      secondLastName: "",
      birthDate: null,
      gender: "" ,
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
  });

  useEffect(() => {
    if (appointmentData) {
      setFormData(prev => ({
        ...prev,
        patient: {
          ...prev.patient,
          documentNumber: appointmentData.patientDNI || "",
          firstName: extractFirstName(appointmentData.patientName),
          lastName: extractLastName(appointmentData.patientName),
        },
        billing: {
          ...prev.billing,
          entity: appointmentData.entity || ""
        },
        products: [
          {
            id: 1,
            code: "CON-002",
            description: `Consulta ${appointmentData.doctorName || ''}`,
            price: 2000, 
            quantity: 1,
            tax: 0,
            discount: 0,
            total: 2000
          }
        ]
      }));
    }
  }, [appointmentData]);

  const extractFirstName = (fullName: string): string => {
    return fullName.split(' ')[0] || "";
  };

  const extractLastName = (fullName: string): string => {
    const parts = fullName.split(' ');
    return parts.length > 1 ? parts.slice(1).join(' ') : "";
  };

  const updateFormData = <K extends keyof FormData>(section: K, data: Partial<FormData[K]>) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  };

  const addPayment = (payment: Omit<FormData['payments'][0], 'id'>) => {
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

  const nextStep = async () => {
    if (stepperRef.current) {
      stepperRef.current.nextCallback();
      setActiveIndex(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (stepperRef.current) {
      stepperRef.current.prevCallback();
      setActiveIndex(prev => prev - 1);
    }
  };

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        visible={visible}
        onHide={onHide}
        header="Nueva Factura"
        style={{ width: '100vw', maxWidth: '1600px' }}
        maximizable
      >
        <Stepper ref={stepperRef}>
          <StepperPanel header="Datos del paciente">
            <PatientStep 
              formData={formData}
              updateFormData={updateFormData}
              nextStep={nextStep}
              toast={toast}
            />
          </StepperPanel>
          
          <StepperPanel header="Productos y Pagos">
            <ProductsPaymentStep 
              formData={formData} 
              updateFormData={updateFormData}
              addPayment={addPayment}
              removePayment={removePayment}
              nextStep={nextStep} 
              prevStep={prevStep} 
              toast={toast} 
            />
          </StepperPanel>
          
          <StepperPanel header="Confirmación y Finalización">
            <PreviewDoneStep 
              formData={formData} 
              prevStep={prevStep} 
              onHide={onHide}
            />
          </StepperPanel>
        </Stepper>
      </Dialog>
    </>
  );
};

export default AdmissionBilling;