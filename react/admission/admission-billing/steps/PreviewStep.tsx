import React from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { calculateTotal, calculatePaid } from "../utils/helpers";

const PreviewStep = ({ formData, nextStep, prevStep }) => {
  const total = calculateTotal(formData.products);
  const paid = calculatePaid(formData.payments);
  const balance = total - paid;

  return (
    <div className="grid">
      <div className="col-12">
        <Card title="Datos del Cliente" className="mb-4">
          <div className="grid">
            <div className="col-12 md:col-6">
              <p><strong>Nombre:</strong> {`${formData.patient.firstName} ${formData.patient.lastName}`}</p>
              <p><strong>Cédula:</strong> {formData.patient.documentNumber}</p>
            </div>
            <div className="col-12 md:col-6">
              <p><strong>Ciudad:</strong> {formData.patient.city}</p>
            </div>
          </div>
        </Card>
        
        <Card title="Detalles de la factura" className="mb-4">
          <DataTable value={formData.products} className="p-datatable-sm">
            <Column field="id" header="#"></Column>
            <Column field="description" header="Descripción"></Column>
            <Column field="quantity" header="Cantidad"></Column>
            <Column field="price" header="Precio"></Column>
            <Column field="tax" header="Descuento"></Column>
            <Column field="total" header="Subtotal"></Column>
          </DataTable>
          
          <div className="grid mt-4">
            <div className="col-12 md:col-6">
              <h4>Métodos de Pago</h4>
              <DataTable value={formData.payments} className="p-datatable-sm">
                <Column field="method" header="Método de Pago"></Column>
                <Column field="amount" header="Monto"></Column>
              </DataTable>
            </div>
            
            <div className="col-12 md:col-6">
              <div className="flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-content-between mb-2">
                <span>Total a Pagar:</span>
                <span>{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-content-between mb-2">
                <span>Pagado:</span>
                <span>{paid.toFixed(2)}</span>
              </div>
              <div className="flex justify-content-between mb-2">
                <span>Saldo:</span>
                <span>{balance.toFixed(2)}</span>
              </div>
              <div className="flex justify-content-between mt-3 font-bold">
                <span>Total Factura:</span>
                <span>{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="flex justify-content-between pt-4 col-12">
        <Button 
          label="Atrás" 
          icon="pi pi-arrow-left" 
          onClick={prevStep}
        />
        <Button 
          label="Finalizar" 
          icon="pi pi-check" 
          onClick={nextStep}
        />
      </div>
    </div>
  );
};

export default PreviewStep;