import React from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { validateProductsStep } from "../utils/helpers";
import { calculateTotal } from "../utils/helpers";

const ProductsStep = ({ formData, updateFormData, nextStep, prevStep, toast }) => {
  const handleAddProduct = (product) => {
    // Lógica para agregar producto
  };

  const handleRemoveProduct = (id) => {
    updateFormData('products', formData.products.filter(p => p.id !== id));
  };

  const handleNext = () => {
    if (validateProductsStep(formData.products, toast)) {
      nextStep();
    }
  };

  return (
    <div className="grid">
      <div className="col-12">
        <Card title="Lista de productos" className="mb-4">
          <div className="mb-4">
            <Dropdown 
              placeholder="Seleccione un producto"
              options={[
                {label: "Consulta Endocrinologia", value: "Consulta Endocrinologia"}
              ]}
              className="w-full"
            />
          </div>
          
          <DataTable value={formData.products} className="p-datatable-sm">
            <Column field="id" header="#"></Column>
            <Column field="description" header="Descripción del Producto"></Column>
            <Column field="price" header="Precio"></Column>
            <Column field="quantity" header="Cantidad"></Column>
            <Column field="tax" header="Impuesto"></Column>
            <Column field="total" header="Total"></Column>
            <Column 
              body={(rowData) => (
                <Button 
                  icon="pi pi-trash" 
                  className="p-button-danger p-button-sm"
                  onClick={() => handleRemoveProduct(rowData.id)}
                />
              )}
            ></Column>
          </DataTable>
          
          <div className="flex justify-content-end mt-3">
            <strong>Total General: {calculateTotal(formData.products).toFixed(2)}</strong>
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
          label="Siguiente" 
          icon="pi pi-arrow-right" 
          iconPos="right" 
          onClick={handleNext}
        />
      </div>
    </div>
  );
};

export default ProductsStep;