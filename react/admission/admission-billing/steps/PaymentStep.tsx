import React from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { paymentMethodOptions } from "../utils/constants";
import { validatePaymentStep, calculateTotal, calculatePaid } from "../utils/helpers";
import { CurrentPayment, PaymentMethod, PaymentStepProps } from "../interfaces/AdmisionBilling";

const PaymentStep: React.FC<PaymentStepProps> = ({ 
  formData, 
  updateFormData, 
  addPayment, 
  removePayment, 
  nextStep, 
  prevStep, 
  toast 
}) => {
  const handlePaymentChange = (field: keyof CurrentPayment, value: string) => {
    updateFormData('currentPayment', { [field]: value });
  };

  const handleAddPayment = () => {
    const { method, amount } = formData.currentPayment;
    
    if (!method || !amount) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Método de pago y monto son requeridos',
        life: 3000
      });
      return;
    }
    
    const paymentAmount = parseFloat(amount);
    if (isNaN(paymentAmount)) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'El monto debe ser un número válido',
        life: 3000
      });
      return;
    }
    
    addPayment({
      method: paymentMethodOptions.find(m => m.value === method)?.label || method,
      amount: paymentAmount,
      authorizationNumber: formData.currentPayment.authorizationNumber,
      notes: formData.currentPayment.notes
    });
    
    updateFormData('currentPayment', {
      method: "",
      amount: "",
      authorizationNumber: "",
      notes: ""
    });
  };

  const handleNext = () => {
    const total = calculateTotal(formData.products);
    if (validatePaymentStep(formData.payments, total, toast)) {
      nextStep();
    }
  };

  return (
    <div className="grid">
      <div className="col-12">
        <Card title="Detalles de la factura" className="mb-4">
          <DataTable 
            value={formData.payments} 
            className="p-datatable-sm"
            emptyMessage="No se han agregado métodos de pago"
          >
            <Column field="id" header="#" style={{ width: '50px' }}></Column>
            <Column field="method" header="Método de Pago"></Column>
            <Column 
              field="amount" 
              header="Monto" 
              body={(rowData: PaymentMethod) => rowData.amount.toFixed(2)}
            ></Column>
            <Column 
              body={(rowData: PaymentMethod) => (
                <Button 
                  icon="pi pi-trash" 
                  className="p-button-danger p-button-sm"
                  onClick={() => removePayment(rowData.id)}
                  tooltip="Eliminar"
                  tooltipOptions={{ position: 'top' }}
                />
              )}
              style={{ width: '80px' }}
            ></Column>
          </DataTable>
          
          <div className="flex justify-content-end mt-3">
            <strong>Total pagado: {calculatePaid(formData.payments).toFixed(2)}</strong>
          </div>
        </Card>
        
        <Card title="Agregar método de pago">
          <div className="grid">
            <div className="col-12 md:col-3">
              <div className="field">
                <label htmlFor="paymentMethod">Método de pago*</label>
                <Dropdown
                  id="paymentMethod"
                  options={paymentMethodOptions}
                  value={formData.currentPayment.method}
                  onChange={(e) => handlePaymentChange('method', e.value)}
                  placeholder="Seleccionar"
                  className="w-full"
                  optionLabel="label"
                />
              </div>
            </div>
            
            <div className="col-12 md:col-3">
              <div className="field">
                <label htmlFor="paymentAmount">Monto*</label>
                <InputText
                  id="paymentAmount"
                  value={formData.currentPayment.amount}
                  onChange={(e) => handlePaymentChange('amount', e.target.value)}
                  className="w-full"
                  keyfilter="money"
                />
              </div>
            </div>
            
            <div className="col-12 md:col-3">
              <div className="field">
                <label htmlFor="paymentAuthNumber">Número de autorización</label>
                <InputText
                  id="paymentAuthNumber"
                  value={formData.currentPayment.authorizationNumber}
                  onChange={(e) => handlePaymentChange('authorizationNumber', e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="col-12 md:col-3">
              <div className="field">
                <label htmlFor="paymentNotes">Observaciones</label>
                <InputText
                  id="paymentNotes"
                  value={formData.currentPayment.notes}
                  onChange={(e) => handlePaymentChange('notes', e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="col-12">
              <Button 
                label="Agregar método de pago" 
                icon="pi pi-plus" 
                className="mt-3"
                onClick={handleAddPayment}
                severity="success"
              />
            </div>
          </div>
        </Card>
      </div>
      
      <div className="flex justify-content-between pt-4 col-12">
        <Button 
          label="Atrás" 
          icon="pi pi-arrow-left" 
          onClick={prevStep}
          severity="secondary"
        />
        <Button 
          label="Siguiente" 
          icon="pi pi-arrow-right" 
          iconPos="right" 
          onClick={handleNext}
          disabled={formData.payments.length === 0}
        />
      </div>
    </div>
  );
};

export default PaymentStep;