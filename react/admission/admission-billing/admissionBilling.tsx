import React, { useState, useRef } from "react";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import PatientStep from "./steps/PatientStep";
import ProductsStep from "./steps/ProductsStep";
import PaymentStep from "./steps/PaymentStep";
import PreviewStep from "./steps/PreviewStep";
import DoneStep from "./steps/DoneStep";

const admissionBilling = ({ visible, onHide }) => {
  const stepperRef = useRef(null);
  const toast = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Estado compartido
  const [formData, setFormData] = useState({
    patient: {
      documentType: "",
      documentNumber: "",
      firstName: "",
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
      authorizedAmount: ""
    },
    products: [
      { id: 1, description: "Consulta Endocrinologia", price: 2000, quantity: 1, tax: 0, total: 2000 }
    ],
    payments: [],
    currentPayment: {
      method: "",
      amount: "",
      authorizationNumber: "",
      notes: ""
    }
  });

  const updateFormData = (section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
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
        style={{ width: '90vw', maxWidth: '1200px' }}
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
          
          <StepperPanel header="Seleccionar producto">
            <ProductsStep 
              formData={formData} 
              updateFormData={updateFormData} 
              nextStep={nextStep} 
              prevStep={prevStep} 
              toast={toast} 
            />
          </StepperPanel>
          
          <StepperPanel header="Métodos de pago">
            <PaymentStep 
              formData={formData} 
              updateFormData={updateFormData} 
              nextStep={nextStep} 
              prevStep={prevStep} 
              toast={toast} 
            />
          </StepperPanel>
          
          <StepperPanel header="Previsualización">
            <PreviewStep 
              formData={formData} 
              nextStep={nextStep} 
              prevStep={prevStep} 
            />
          </StepperPanel>
          
          <StepperPanel header="Hecho">
            <DoneStep onHide={onHide} />
          </StepperPanel>
        </Stepper>
      </Dialog>
    </>
  );
};

export default admissionBilling;